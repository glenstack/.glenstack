import { GraphQLScalarType } from "graphql";
import typeDefs from "./identifier.graphql";

export { typeDefs };
export const resolvers = {
  Identifier: new GraphQLScalarType({
    name: "Identifier",
    description: "A camel case `String` used to identify an object in the API.",

    // TODO: Validate identifiers

    // parseValue: () => {},
    // serialize: () => {},
    // parseLiteral: () => {},
  }),
};
