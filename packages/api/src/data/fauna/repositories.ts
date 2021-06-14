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
import { createCollectionAndWait, query } from "./utils";

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
    } = await query<FaunaResponse>(
      this._client,
      q.If(
        q.IsEmpty(
          q.Match(q.Index("organizations_apiName_unique"), item.apiName)
        ),
        q.Create(q.Collection("organizations"), {
          data: {
            ...item,
          },
        }),
        q.Abort(`apiName ${item.apiName} already exists.`)
      )
    );
    return id;
  }
  async get(id: string): Promise<Organization<Omit<Project, "tables">>> {
    return await query<Organization>(
      this._client,
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
    );
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
    } = await query<FaunaResponse>(
      this._client,
      q.If(
        q.IsEmpty(q.Match(q.Index("projects_apiName_unique"), apiName)),
        q.Create(q.Collection("projects"), {
          data: { ...projectInput },
        }),
        q.Abort(`apiName ${apiName} already exists within the organization`)
      )
    );
    return id;
  }
  async get(id: string): Promise<Project> {
    return await query<Project>(
      this._client,
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
    );
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
    const id: string = await query(this._client, q.NewId());
    await createCollectionAndWait(this._client, id);
    await query(
      this._client,
      q.If(
        q.IsEmpty(q.Match(q.Index("tables_apiName_unique"), apiName)),
        q.Create(q.Ref(q.Collection("tables"), id), {
          data: { ...tableInput },
        }),
        q.Abort(`apiName ${apiName} already exists within the project`)
      )
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
      tableRef: q.Ref(q.Collection("tables"), tableId),
    };

    const {
      ref: { id },
    } = await query<FaunaResponse>(
      this._client,
      q.If(
        q.IsEmpty(q.Match(q.Index("fields_apiName_unique"), fieldObj.apiName)),
        q.Create(q.Collection("fields"), {
          data: { ...fieldPayload },
        }),
        q.Abort(
          `apiName ${fieldPayload.apiName} already exists within the table`
        )
      )
    );
    return id;
  }
}

export class RelationshipFieldRepository extends BaseRepository<
  Omit<RelationshipFieldInput, "tableRef" | "relationshipRef" | "type"> & {
    tableId: string;
    to: string;
    backName: string;
    backApiName: string;
  }
> {
  async create({
    tableId,
    backName, // Name of the field that references back to the created relational field
    backApiName,
    ...fieldObj
  }: Omit<RelationshipFieldInput, "tableRef" | "relationshipRef" | "type"> & {
    tableId: string;
    to: string;
    backName: string;
    backApiName: string;
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
      apiName: backApiName,
      to: q.Ref(q.Collection("tables"), tableId),
      tableRef: q.Ref(q.Collection("tables"), fieldObj.to),
    };

    const {
      ref: { id },
    } = await query<FaunaResponse>(
      this._client,
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
          q.If(
            q.IsEmpty(
              q.Match(q.Index("fields_apiName_unique"), fieldPayload.apiName)
            ),
            q.Create(q.Collection("fields"), {
              data: {
                ...fieldPayload,
                relationshipRef: q.Select("ref", q.Var("relationship")),
              },
            }),
            q.Abort(
              `apiName ${fieldPayload.apiName} already exists within the table`
            )
          ),
          q.If(
            q.IsEmpty(
              q.Match(
                q.Index("fields_apiName_unique"),
                backFieldPayload.apiName
              )
            ),
            q.Create(q.Collection("fields"), {
              data: {
                ...backFieldPayload,
                relationshipRef: q.Select("ref", q.Var("relationship")),
              },
            }),
            q.Abort(
              `apiName ${backFieldPayload.apiName} already exists within the table`
            )
          )
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
