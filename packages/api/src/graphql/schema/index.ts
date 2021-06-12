import { Resolvers } from "../__generated__/graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "./index.graphql";
import {
  typeDefs as scalarTypeDefs,
  resolvers as scalarResolvers,
} from "./scalars";
import {
  typeDefs as relayTypeDefs,
  resolvers as relayResolvers,
} from "./relay";
import {
  typeDefs as legalTypeDefs,
  resolvers as legalResolvers,
} from "./legal";
import {
  typeDefs as organizationTypeDefs,
  resolvers as organizationResolvers,
} from "./organization";
import {
  typeDefs as projectTypeDefs,
  resolvers as projectResolvers,
} from "./project";
import { typeDefs as typeTypeDefs, resolvers as typeResolvers } from "./type";
import {
  typeDefs as propertyTypeDefs,
  resolvers as propertyResolvers,
} from "./property";

const resolvers: Resolvers = {
  Query: {
    version: () => VERSION,
  },
  Mutation: {
    version: () => VERSION,
  },
};

export const schema = makeExecutableSchema({
  typeDefs: [
    typeDefs,
    ...scalarTypeDefs,
    relayTypeDefs,
    legalTypeDefs,
    organizationTypeDefs,
    projectTypeDefs,
    typeTypeDefs,
    propertyTypeDefs,
  ],
  resolvers: [
    resolvers,
    ...scalarResolvers,
    relayResolvers,
    legalResolvers,
    organizationResolvers,
    projectResolvers,
    typeResolvers,
    propertyResolvers,
  ],
});
