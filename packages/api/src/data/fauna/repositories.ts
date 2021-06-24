import {
  FaunaResponse,
  FieldInput,
  OrganizationInput,
  ProjectInput,
  RelationshipFieldInput,
  ScalarFieldInput,
  TableInput,
  IRepository,
} from "../types";
import { Client, query as q } from "faunadb";
import { createCollectionAndWait } from "./utils";

abstract class BaseRepository<T> implements IRepository<T> {
  public readonly _client: Client;
  constructor(client: Client) {
    this._client = client;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(item: T): Promise<string> {
    throw new Error("Method not implemented.");
  }
}

export class OrganizationRepository extends BaseRepository<OrganizationInput> {
  async create(item: OrganizationInput): Promise<string> {
    const {
      ref: { id },
    } = await this._client.query<FaunaResponse>(
      q.Create(q.Collection("organizations"), {
        data: {
          ...item,
        },
      })
    );
    return id;
  }
}

export class ProjectRepository extends BaseRepository<
  Omit<ProjectInput, "organizationRef"> & { organizationId: string }
> {
  async create({
    organizationId,
    name,
    apiName,
  }: Omit<ProjectInput, "organizationRef"> & {
    organizationId: string;
  }): Promise<string> {
    const projectInput: ProjectInput = {
      name,
      apiName,
      organizationRef: q.Ref(q.Collection("organizations"), organizationId),
    };
    const {
      ref: { id },
    } = await this._client.query<FaunaResponse>(
      q.Create(q.Collection("projects"), {
        data: { ...projectInput },
      })
    );
    return id;
  }
}

export class TableRespository extends BaseRepository<
  Omit<TableInput, "projectRef"> & { projectId: string }
> {
  async create({
    projectId,
    name,
    apiName,
  }: Omit<TableInput, "projectRef"> & { projectId: string }): Promise<string> {
    const tableInput: TableInput = {
      name,
      apiName,
      projectRef: q.Ref(q.Collection("projects"), projectId),
    };
    const id: string = await this._client.query(q.NewId());
    await createCollectionAndWait(this._client, id);
    await this._client.query(
      q.Create(q.Ref(q.Collection("tables"), id), {
        data: { ...tableInput },
      })
    );

    return id;
  }
}

export class ScalarFieldRepository extends BaseRepository<
  Omit<ScalarFieldInput, "tableRef"> & {
    tableId: string;
  }
> {
  async create({
    tableId,
    ...fieldObj
  }: Omit<ScalarFieldInput, "tableRef"> & {
    tableId: string;
  }): Promise<string> {
    const fieldPayload: FieldInput = {
      ...fieldObj,
      apiName: fieldObj.name,
      tableRef: q.Ref(q.Collection("tables"), tableId),
    };

    const {
      ref: { id },
    } = await this._client.query<FaunaResponse>(
      q.Create(q.Collection("fields"), {
        data: { ...fieldPayload },
      })
    );
    return id;
  }
}

export class RelationshipFieldRepository extends BaseRepository<
  Omit<RelationshipFieldInput, "tableRef" | "relationshipRef" | "type"> & {
    tableId: string;
    to: string;
    backName: string;
    apiBackName: string;
  }
> {
  private async createUnidirectional({
    tableId,
    ...fieldObj
  }: Omit<RelationshipFieldInput, "tableRef" | "relationshipRef" | "type"> & {
    tableId: string;
    to: string;
  }) {
    const fieldPayload: Omit<RelationshipFieldInput, "relationshipRef"> = {
      ...fieldObj,
      to: q.Ref(q.Collection("tables"), fieldObj.to),
      type: "Relation",
      apiName: fieldObj.name,
      tableRef: q.Ref(q.Collection("tables"), tableId),
    };
    const {
      ref: { id },
    } = await this._client.query<FaunaResponse>(
      q.Let(
        {
          relationship: q.Create(q.Collection("relationships"), {
            data: {
              A: q.Ref(q.Collection("tables"), tableId),
              B: q.Ref(q.Collection("tables"), fieldObj.to),
            },
          }),
        },
        q.Do(
          q.Create(q.Collection("fields"), {
            data: {
              ...fieldPayload,
              relationshipRef: q.Select("ref", q.Var("relationship")),
            },
          })
        )
      )
    );
    return id;
  }

  private async createBidirectional({
    tableId,
    backName,
    apiBackName,
    ...fieldObj
  }: Omit<RelationshipFieldInput, "tableRef" | "relationshipRef" | "type"> & {
    tableId: string;
    to: string;
    backName: string;
    apiBackName: string;
  }) {
    const fieldPayload: Omit<RelationshipFieldInput, "relationshipRef"> = {
      ...fieldObj,
      to: q.Ref(q.Collection("tables"), fieldObj.to),
      type: "Relation",
      apiName: fieldObj.name,
      tableRef: q.Ref(q.Collection("tables"), tableId),
    };
    const backFieldPayload: Omit<RelationshipFieldInput, "relationshipRef"> = {
      type: "Relation",
      name: backName,
      apiName: apiBackName,
      to: q.Ref(q.Collection("tables"), tableId),
      tableRef: q.Ref(q.Collection("tables"), fieldObj.to),
    };
    const {
      ref: { id },
    } = await this._client.query<FaunaResponse>(
      q.Let(
        {
          relationship: q.Create(q.Collection("relationships"), {
            data: {
              A: q.Ref(q.Collection("tables"), tableId),
              B: q.Ref(q.Collection("tables"), fieldObj.to),
            },
          }),
        },
        q.Do(
          q.Create(q.Collection("fields"), {
            data: {
              ...fieldPayload,
              relationshipRef: q.Select("ref", q.Var("relationship")),
            },
          }),
          q.Create(q.Collection("fields"), {
            data: {
              ...backFieldPayload,
              relationshipRef: q.Select("ref", q.Var("relationship")),
            },
          })
        )
      )
    );
    return id;
  }

  async create(
    input: Omit<
      RelationshipFieldInput,
      "tableRef" | "relationshipRef" | "type"
    > &
      (
        | {
            tableId: string;
            to: string;
          }
        | {
            tableId: string;
            to: string;
            backName: string;
            apiBackName: string;
          }
      )
  ): Promise<string> {
    return "backName" in input
      ? this.createBidirectional(input)
      : this.createUnidirectional(input);
  }
}
