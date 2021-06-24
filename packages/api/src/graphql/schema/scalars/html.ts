import { GraphQLScalarType } from "graphql";
import typeDefs from "./html.graphql";

export { typeDefs };
export const resolvers = {
  HTML: new GraphQLScalarType({
    name: "HTML",
    description: "A `String` of HTML.",

    // TODO: Validate HTML (maybe with a DOM parser or something?)

    // parseValue: () => {},
    // serialize: () => {},
    // parseLiteral: () => {},
  }),
};
