import { makeExecutableSchema } from "@graphql-tools/schema";

const typeDefs = [];
const resolvers = [];

export const schema = makeExecutableSchema({ typeDefs, resolvers });
