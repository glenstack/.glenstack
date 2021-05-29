import { query as q } from "faunadb";

import { client } from "./fauna/client";
import { generateGraphQLSchema } from "./generateGraphQLSchema";
import { GraphQLSchema } from "graphql";
import {
  FaunaResponse,
  OrganizationInput,
  ProjectInput,
  ScalarField,
  ScalarFieldInput,
  TableInput,
} from "./types";
import to from "await-to-js";

export const getSchema = async (): Promise<GraphQLSchema> => {
  const [err, data] = await to(
    client.query<{
      organizations: Array<{ projects: Array<unknown> }>;
    }>({
      organizations: q.Select(
        "data",
        q.Map(
          q.Paginate(q.Documents(q.Collection("organizations"))),
          q.Lambda(
            "organizationRef",
            q.Merge(
              q.Select("data", q.Get(q.Var("organizationRef"))),

              {
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
                        tables: q.Select(
                          "data",
                          q.Map(
                            q.Paginate(
                              q.Match(
                                q.Index("tables_by_project"),
                                q.Var("projectRef")
                              )
                            ),
                            q.Lambda(
                              "tableRef",
                              q.Merge(
                                q.Select("data", q.Get(q.Var("tableRef"))),
                                {
                                  id: q.Select(
                                    ["ref", "id"],
                                    q.Get(q.Var("tableRef"))
                                  ),
                                  fields: q.Select(
                                    "data",
                                    q.Map(
                                      q.Paginate(
                                        q.Match(
                                          q.Index("fields_by_table"),
                                          q.Var("tableRef")
                                        )
                                      ),
                                      q.Lambda(
                                        "fieldRef",
                                        q.Merge(
                                          q.Select(
                                            "data",
                                            q.Get(q.Var("fieldRef"))
                                          ),
                                          [
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
                                                      [
                                                        "data",
                                                        "relationshipRef",
                                                      ],
                                                      q.Get(q.Var("fieldRef"))
                                                    )
                                                  )
                                                ),
                                              },
                                              {}
                                            ),
                                          ]
                                        )
                                      )
                                    )
                                  ),
                                }
                              )
                            )
                          )
                        ),
                      })
                    )
                  )
                ),
              }
            )
          )
        )
      ),
    })
  );
  if (!data) throw new Error("Failed to fetch schema from Fauna: " + err);
  return generateGraphQLSchema(data.organizations[0].projects[0]);
};

export const createOrganization = async ({
  name,
}: {
  name: string;
}): Promise<unknown> => {
  const organizationInput: OrganizationInput = { name, apiName: name };

  const {
    data,
    ref: { id },
  } = await client.query<FaunaResponse>(
    q.Create(q.Collection("organizations"), {
      data: {
        ...organizationInput,
      },
    })
  );
  return { id, ...data };
};
export const createProject = async ({
  organizationId,
  name,
}: {
  organizationId: string;
  name: string;
}): Promise<unknown> => {
  const projectInput: ProjectInput = {
    name,
    apiName: name,
    organizationRef: q.Ref(q.Collection("organizations"), organizationId),
  };
  const {
    data,
    ref: { id },
  } = await client.query<FaunaResponse>(
    q.Create(q.Collection("projects"), {
      data: { ...projectInput },
    })
  );
  return { id, ...data };
};

export const createTable = async ({
  projectId,
  name,
}: {
  projectId: string;
  name: string;
}): Promise<unknown> => {
  const tableInput: TableInput = {
    name,
    apiName: name,
    projectRef: q.Ref(q.Collection("projects"), projectId),
  };
  const {
    data,
    ref: { id },
  } = await client.query<FaunaResponse>(
    q.Create(q.Collection("tables"), {
      data: { ...tableInput },
    })
  );
  await client.query(q.CreateCollection({ name: id }));
  return { id, ...data };
};

export const createField = async ({
  tableId,
  name,
  type,
}: {
  tableId: string;
  name: string;
  type: ScalarField["type"];
}): Promise<unknown> => {
  const fieldInput: ScalarFieldInput = {
    name,
    type,
    apiName: name,
    tableRef: q.Ref(q.Collection("tables"), tableId),
  };
  const {
    data,
    ref: { id },
  } = await client.query<FaunaResponse>(
    q.Create(q.Collection("fields"), {
      data: { ...fieldInput },
    })
  );
  return { id, ...data };
};
