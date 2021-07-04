import { Client } from "faunadb";

import graphQLSchema from "./graphQLSchema";
import { GraphQLSchema } from "graphql";
import repositories from "./fauna/repositories";

export const getProjectSchema = async (
  client: Client,
  projectId: string
): Promise<GraphQLSchema> => {
  const data = await repositories(client).project.get(projectId);
  console.log(data);
  return graphQLSchema(data, client);
};
