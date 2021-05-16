/* eslint-disable */

import { queryType, mutationType } from "./generateGraphQLTypes";
import { GraphQLSchema } from "graphql";

export const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
