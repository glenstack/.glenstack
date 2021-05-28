import { query as q } from "faunadb";

import { client } from "./fauna/client";
import { generateGraphQLSchema } from "./generateGraphQLSchema";
import { GraphQLSchema } from "graphql";

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
