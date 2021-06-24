import { typeDefs as htmlTypeDefs, resolvers as htmlResolvers } from "./html";
import {
  typeDefs as identifierTypeDefs,
  resolvers as identifierResolvers,
} from "./identifier";

export const typeDefs = [htmlTypeDefs, identifierTypeDefs];
export const resolvers = [htmlResolvers, identifierResolvers];
