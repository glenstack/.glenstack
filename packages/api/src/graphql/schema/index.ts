import { makeExecutableSchema } from "@graphql-tools/schema";
import type { GraphQLSchema } from "graphql";
import type { Context } from "./../context";
import { Resolvers } from "../__generated__/graphql";
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
  generateTypeDefs as generateOrganizationTypeDefs,
  generateResolvers as generateOrganizationResolvers,
} from "./organization";
import {
  generateTypeDefs as generateProjectTypeDefs,
  generateResolvers as generateProjectResolvers,
} from "./project";
import {
  generateTypeDefs as generateTypeTypeDefs,
  resolvers as generateTypeResolvers,
} from "./type";
import {
  generateTypeDefs as generatePropertyTypeDefs,
  resolvers as generatePropertyResolvers,
} from "./property";

const resolvers: Resolvers = {
  Query: {
    version: () => VERSION,
  },
  Mutation: {
    version: () => VERSION,
  },
};

export const schema = async ({
  context,
}: {
  context: Context;
}): Promise<GraphQLSchema> =>
  makeExecutableSchema({
    typeDefs: [
      typeDefs,
      ...scalarTypeDefs,
      relayTypeDefs,
      legalTypeDefs,
      ...(await generateOrganizationTypeDefs({ context })),
      ...(await generateProjectTypeDefs({ context })),
      ...(await generateTypeTypeDefs({ context })),
      ...(await generatePropertyTypeDefs({ context })),
    ],
    resolvers: [
      resolvers,
      ...scalarResolvers,
      relayResolvers,
      legalResolvers,
      ...(await generateOrganizationResolvers({ context })),
      ...(await generateProjectResolvers({ context })),
      ...(await generateTypeResolvers({ context })),
      ...(await generatePropertyResolvers({ context })),
    ],
  });
