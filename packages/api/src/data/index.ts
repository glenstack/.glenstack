import { query as q } from "faunadb";

import { client } from "./fauna/client";
import { generateGraphQLSchema } from "./generateGraphQLSchema";
import { GraphQLSchema } from "graphql";
import {
  FaunaResponse,
  OrganizationInput,
  ProjectInput,
  ScalarField,
  TableInput,
} from "./types";

export const getSchema = async (): Promise<GraphQLSchema> => {
  const data = await client.query<{
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
                                collectionName: q.Select(
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
                                        {
                                          fieldId: q.Select(
                                            ["ref", "id"],
                                            q.Get(q.Var("fieldRef"))
                                          ),
                                        }
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
  });
  return generateGraphQLSchema(data.organizations[0].projects[0]);
};

export const createOrganization = async ({
  name,
}: {
  name: string;
}): Promise<unknown> => {
  const organizationPayload: OrganizationInput = { name, apiName: name };

  const {
    data,
    ref: { id },
  } = await client.query<FaunaResponse>(
    q.Create(q.Collection("organizations"), {
      data: {
        ...organizationPayload,
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
  const fieldInput: ScalarField = {
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
