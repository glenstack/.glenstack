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
import { Client } from "faunadb";
import { createCollectionAndWait, query, enrichedQuery as q } from "./utils";

//TODO: Generate apiNames automatically by camelcasing string

abstract class BaseRepository<T> implements IRepository<T> {
  public readonly _client: Client;

  constructor(client: Client) {
    this._client = client;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(createInput: T): Promise<string> {
    throw new Error("Method not implemented.");
  }
}

export class OrganizationRepository extends BaseRepository<OrganizationInput> {
  async create(createInput: OrganizationInput): Promise<string> {
    const {
      ref: { id },
    } = await query<FaunaResponse>(
      this._client,
      q.WithoutDuplicates(
        q.Create(q.Collection("organizations"), {
          data: {
            ...createInput,
          },
        }),
        q.Match(q.Index("organizations_apiName_unique"), createInput.apiName),
        `apiName ${createInput.apiName} already exists.`
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
    ...createInput
  }: Omit<ProjectInput, "organizationRef"> & {
    organizationId: string;
  }): Promise<string> {
    const projectPayload: ProjectInput = {
      ...createInput,
      organizationRef: q.Ref(q.Collection("organizations"), organizationId),
    };
    const {
      ref: { id },
    } = await query<FaunaResponse>(
      this._client,
      q.If(
        q.IsEmpty(
          q.Match(q.Index("projects_apiName_unique"), createInput.apiName)
        ),
        q.Create(q.Collection("projects"), {
          data: { ...projectPayload },
        }),
        q.Abort(
          `apiName ${createInput.apiName} already exists within the organization`
        )
      )
    );
    return id;
  }
  async update(
    id: string,
    {
      organizationId,
      ...updateInput
    }: Partial<
      Omit<ProjectInput, "organizationRef"> & {
        organizationId: string;
      }
    >
  ): Promise<string> {
    const projectPayload: Partial<ProjectInput> = updateInput;

    if (organizationId) {
      projectPayload.organizationRef = q.Ref(
        q.Collection("organizations"),
        organizationId
      );
    }

    let queryExpr = q.Update(q.Ref(q.Collection("projects"), id), {
      data: { ...projectPayload },
    });

    if (updateInput.apiName) {
      {
        queryExpr = q.WithoutDuplicates(
          queryExpr,
          q.Match(q.Index("projects_apiName_unique"), updateInput.apiName),
          `apiName ${updateInput.apiName} already exists within the organization`
        );
      }
    }

    await query<FaunaResponse>(this._client, queryExpr);

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
    ...createInput
  }: Omit<TableInput, "projectRef"> & { projectId: string }): Promise<string> {
    const tablePayload: TableInput = {
      ...createInput,
      projectRef: q.Ref(q.Collection("projects"), projectId),
    };
    const id: string = await query(this._client, q.NewId());
    await createCollectionAndWait(this._client, id);
    await query(
      this._client,
      q.If(
        q.IsEmpty(
          q.Match(q.Index("tables_apiName_unique"), createInput.apiName)
        ),
        q.Create(q.Ref(q.Collection("tables"), id), {
          data: { ...tablePayload },
        }),
        q.Abort(
          `apiName ${createInput.apiName} already exists within the project`
        )
      )
    );

    return id;
  }
  async update(
    id: string,
    {
      projectId,
      ...updateInput
    }: Partial<Omit<TableInput, "projectRef"> & { projectId: string }>
  ): Promise<string> {
    const tablePayload: Partial<TableInput> = updateInput;
    if (projectId) {
      tablePayload.projectRef = q.Ref(q.Collection("projects"), projectId);
    }

    let queryExpr = q.Update(q.Ref(q.Collection("tables"), id), {
      data: tablePayload,
    });

    if (tablePayload.apiName) {
      {
        queryExpr = q.WithoutDuplicates(
          queryExpr,
          q.Match(q.Index("projects_apiName_unique"), tablePayload.apiName),
          `apiName ${tablePayload.apiName} already exists within the organization`
        );
      }
    }

    await query<FaunaResponse>(this._client, queryExpr);

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
    ...createInput
  }: Omit<ScalarFieldInput, "tableRef"> & {
    tableId: string;
  }): Promise<string> {
    const fieldPayload: FieldInput = {
      ...createInput,
      tableRef: q.Ref(q.Collection("tables"), tableId),
    };

    const {
      ref: { id },
    } = await query<FaunaResponse>(
      this._client,
      q.If(
        q.IsEmpty(
          q.Match(q.Index("fields_apiName_unique"), createInput.apiName)
        ),
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

  async update(
    id: string,
    updateInput: Partial<Pick<ScalarFieldInput, "name" | "apiName">>
  ): Promise<string> {
    const fieldPayload: Partial<Pick<ScalarFieldInput, "name" | "apiName">> = {
      ...updateInput,
    };

    let queryExpr = q.Update(q.Ref(q.Collection("fields"), id), {
      data: fieldPayload,
    });

    if (fieldPayload.apiName) {
      {
        queryExpr = q.WithoutDuplicates(
          queryExpr,
          q.Match(q.Index("projects_apiName_unique"), fieldPayload.apiName),
          `apiName ${fieldPayload.apiName} already exists within the organization`
        );
      }
    }

    await query<FaunaResponse>(this._client, queryExpr);

    return id;
  }
}

export class RelationshipFieldRepository extends BaseRepository<
  Omit<RelationshipFieldInput, "tableRef" | "relationshipRef" | "type"> & {
    tableId: string;
    to: string;
  }
> {
  async create({
    tableId,
    ...createInput
  }: Omit<RelationshipFieldInput, "tableRef" | "relationshipRef" | "type"> & {
    tableId: string;
    to: string;
  }): Promise<string> {
    const fieldPayload: Omit<RelationshipFieldInput, "relationshipRef"> = {
      ...createInput,
      type: "Relation",
      to: q.Ref(q.Collection("tables"), createInput.to),
      tableRef: q.Ref(q.Collection("tables"), tableId),
    };

    const id = await query<string>(
      this._client,
      q.Let(
        {
          relationship: q.Create(q.Collection("relationships"), {
            data: {
              A: q.Ref(q.Collection("tables"), tableId),
              B: q.Ref(q.Collection("tables"), createInput.to),
            },
          }),
        },
        q.WithoutDuplicates(
          q.Select(
            ["ref", "id"],
            q.Create(q.Collection("fields"), {
              data: {
                ...fieldPayload,
                relationshipRef: q.Select("ref", q.Var("relationship")),
              },
            })
          ),
          q.Match(q.Index("fields_apiName_unique"), fieldPayload.apiName),
          `apiName ${fieldPayload.apiName} already exists within the table`
        )
      )
    );
    return id;
  }

  async createBidirectional({
    tableId,
    backName, // Name of the field that references back to the created relational field
    backApiName,
    ...createInput
  }: Omit<RelationshipFieldInput, "tableRef" | "relationshipRef" | "type"> & {
    tableId: string;
    to: string;
    backName: string;
    backApiName: string;
  }): Promise<Array<string>> {
    const fieldPayload: Omit<RelationshipFieldInput, "relationshipRef"> = {
      ...createInput,
      type: "Relation",
      to: q.Ref(q.Collection("tables"), createInput.to),
      tableRef: q.Ref(q.Collection("tables"), tableId),
    };
    const backFieldPayload: Omit<RelationshipFieldInput, "relationshipRef"> = {
      type: "Relation",
      name: backName,
      apiName: backApiName,
      to: q.Ref(q.Collection("tables"), tableId),
      tableRef: q.Ref(q.Collection("tables"), createInput.to),
    };

    const ids = await query<Array<string>>(
      this._client,
      q.Let(
        {
          relationship: q.Create(q.Collection("relationships"), {
            data: {
              A: q.Ref(q.Collection("tables"), tableId),
              B: q.Ref(q.Collection("tables"), createInput.to),
            },
          }),
        },
        q.Do([
          q.WithoutDuplicates(
            q.Select(
              ["ref", "id"],
              q.Create(q.Collection("fields"), {
                data: {
                  ...fieldPayload,
                  relationshipRef: q.Select("ref", q.Var("relationship")),
                },
              })
            ),
            q.Match(q.Index("fields_apiName_unique"), fieldPayload.apiName),
            `apiName ${fieldPayload.apiName} already exists within the table`
          ),
          q.WithoutDuplicates(
            q.Select(
              ["ref", "id"],
              q.Create(q.Collection("fields"), {
                data: {
                  ...backFieldPayload,
                  relationshipRef: q.Select("ref", q.Var("relationship")),
                },
              })
            ),
            q.Match(q.Index("fields_apiName_unique"), backFieldPayload.apiName),
            `apiName ${backFieldPayload.apiName} already exists within the table`
          ),
        ])
      )
    );
    return ids;
  }

  async update(
    id: string,
    updateInput: Partial<Pick<RelationshipFieldInput, "name" | "apiName">>
  ): Promise<string> {
    const fieldPayload: Partial<
      Pick<RelationshipFieldInput, "name" | "apiName">
    > = updateInput;

    let queryExpr = q.Update(q.Ref(q.Collection("fields"), id), {
      data: fieldPayload,
    });

    if (fieldPayload.apiName) {
      {
        queryExpr = q.WithoutDuplicates(
          queryExpr,
          q.Match(q.Index("projects_apiName_unique"), fieldPayload.apiName),
          `apiName ${fieldPayload.apiName} already exists within the organization`
        );
      }
    }

    await query<FaunaResponse>(this._client, queryExpr);

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
