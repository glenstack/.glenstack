import {
  FaunaResponse,
  FieldInput,
  OrganizationInput,
  ProjectInput,
  RelationshipFieldInput,
  ScalarFieldInput,
  TableInput,
  IRepository,
  Organization,
  Project,
} from "../types";
import { Client, query as q } from "faunadb";
import { createCollectionAndWait } from "./utils";
import to from "await-to-js";

//TODO: Genereate apiNames automatically by camelcasing string

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
  async get(id: string): Promise<Organization<Omit<Project, "tables">>> {
    const [err, data] = await to(
      this._client.query<Organization>(
        q.Let(
          { organizationRef: q.Ref(q.Collection("organizations"), id) },
          q.Merge(q.Select("data", q.Get(q.Var("organizationRef"))), {
            id,
            projects: q.Select(
              "data",
              q.Map(
                q.Paginate(
                  q.Match(
                    q.Index("projects_by_organization"),
                    q.Var("organizationRef")
                  )
                ),
                q.Lambda(
                  "projectRef",
                  q.Merge(q.Select("data", q.Get(q.Var("projectRef"))), {
                    id: q.Select("id", q.Var("projectRef")),
                  })
                )
              )
            ),
          })
        )
      )
    );
    if (!data) throw new Error("Failed to fetch project: " + err);
    return data;
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
  async get(id: string): Promise<Project> {
    const [err, data] = await to(
      this._client.query<Project>(
        q.Let(
          { projectRef: q.Ref(q.Collection("projects"), id) },
          q.Merge(q.Select("data", q.Get(q.Var("projectRef"))), {
            id,
            tables: q.Select(
              "data",
              q.Map(
                q.Paginate(
                  q.Match(q.Index("tables_by_project"), q.Var("projectRef"))
                ),
                q.Lambda(
                  "tableRef",
                  q.Merge(q.Select("data", q.Get(q.Var("tableRef"))), {
                    id: q.Select(["ref", "id"], q.Get(q.Var("tableRef"))),
                    fields: q.Select(
                      "data",
                      q.Map(
                        q.Paginate(
                          q.Match(q.Index("fields_by_table"), q.Var("tableRef"))
                        ),
                        q.Lambda(
                          "fieldRef",
                          q.Merge(q.Select("data", q.Get(q.Var("fieldRef"))), [
                            {
                              id: q.Select(
                                ["ref", "id"],
                                q.Get(q.Var("fieldRef"))
                              ),
                            },
                            q.If(
                              q.ContainsPath(
                                ["data", "relationshipRef"],
                                q.Get(q.Var("fieldRef"))
                              ),
                              {
                                relationship: q.Select(
                                  ["data"],
                                  q.Get(
                                    q.Select(
                                      ["data", "relationshipRef"],
                                      q.Get(q.Var("fieldRef"))
                                    )
                                  )
                                ),
                              },
                              {}
                            ),
                          ])
                        )
                      )
                    ),
                  })
                )
              )
            ),
          })
        )
      )
    );
    if (!data) throw new Error("Failed to fetch project: " + err);
    return data;
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
  async create({
    tableId,
    backName, // Name of the field that references back to the created relational field
    apiBackName,
    ...fieldObj
  }: Omit<RelationshipFieldInput, "tableRef" | "relationshipRef" | "type"> & {
    tableId: string;
    to: string;
    backName: string;
    apiBackName: string;
  }): Promise<string> {
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
}

const repositories = (
  client: Client
): {
  organization: OrganizationRepository;
  project: ProjectRepository;
  table: TableRespository;
  relationshipField: RelationshipFieldRepository;
  scalarField: ScalarFieldRepository;
} => ({
  organization: new OrganizationRepository(client),
  project: new ProjectRepository(client),
  table: new TableRespository(client),
  relationshipField: new RelationshipFieldRepository(client),
  scalarField: new ScalarFieldRepository(client),
});

export default repositories;
