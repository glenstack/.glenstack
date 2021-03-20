import { makeExecutableSchema } from "@graphql-tools/schema";
import gql from "graphql-tag";
import { testFauna } from "../../data/fauna";

const typeDefs = gql`
  type Query {
    hello: String!
  }
`;

const resolvers = {
  Query: {
    hello: async () => JSON.stringify("hello"),
  },
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });
