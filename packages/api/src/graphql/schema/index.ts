import { makeExecutableSchema } from "@graphql-tools/schema";
import gql from "graphql-tag";
import {
  typeDefs as scalarTypeDefs,
  resolvers as scalarResolvers,
} from "./scalars";
import {
  typeDefs as legalTypeDefs,
  resolvers as legalResolvers,
} from "./legal";

const typeDefs = gql`
  """
  The query root of Glenstack's GraphQL API.
  """
  type Query {
    """
    The current version of the Glenstack API.
    """
    version: String!
  }
`;

const resolvers = {
  Query: {
    version: () => VERSION,
  },
};

export const schema = makeExecutableSchema({
  typeDefs: [typeDefs, ...scalarTypeDefs, legalTypeDefs],
  resolvers: [resolvers, ...scalarResolvers, legalResolvers],
});
