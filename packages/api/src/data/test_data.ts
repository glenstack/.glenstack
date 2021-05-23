import { ApolloServer } from "apollo-server";

import { schema } from "./index";
import { query as q } from "faunadb";

import { client } from "./fauna/client";
import { generateGraphQLSchema } from "./generateGraphQLSchema";

client
  .query({
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
  })
  .then((data: any) => {
    const server = new ApolloServer({
      schema: generateGraphQLSchema(data.organizations[0].projects[0]),
    });
    server.listen().then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
    console.log(JSON.stringify(data));
  });
