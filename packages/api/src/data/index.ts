import { query as q, Client } from "faunadb";

import generateGraphQLSchema from "./generateGraphQLSchema";
import { GraphQLSchema } from "graphql";
import repositories from "./fauna/repositories";

export const getProjectSchema = async (
  client: Client,
  projectId: string
): Promise<GraphQLSchema> => {
  const data = await repositories(client).project.get(projectId);
  console.log(data);
  return generateGraphQLSchema(data, client);
};
