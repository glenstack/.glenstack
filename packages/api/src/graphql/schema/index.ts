import { makeExecutableSchema } from "@graphql-tools/schema";
import gql from "graphql-tag";

const typeDefs = gql`
  type Query {
    hello: String!
    version: String!
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello, world!",
    version: () => VERSION,
  },
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });
