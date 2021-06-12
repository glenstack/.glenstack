import { client } from "../../data/fauna/client";
import {
  RelationshipFieldRepository,
  ScalarFieldRepository,
} from "../../data/fauna/repositories";
import type { Resolvers } from "../__generated__/graphql";
import typeDefs from "./property.graphql";

export { typeDefs };
export const resolvers: Resolvers = {
  Mutation: {
    createScalarProperty: async (parent, { input }) => {
      const scalarFieldRepository = new ScalarFieldRepository(client);
      const id = await scalarFieldRepository.create({
        tableId: input.typeId,
        apiName: input.identifier,
        name: input.name,
        type:
          input.dataType === "STRING"
            ? "String"
            : input.dataType === "BOOLEAN"
            ? "Boolean"
            : input.dataType === "NUMBER"
            ? "Number"
            : "String",
      });
      return {
        property: {
          id,
        },
      };
    },
    createRelationalProperty: async (parent, { input }) => {
      const relationshipFieldRepository = new RelationshipFieldRepository(
        client
      );
      const id = await relationshipFieldRepository.create({
        tableId: input.typeId,
        apiName: input.identifier,
        name: input.name,
        to: input.toTypeId,
      });
      return {
        property: {
          id,
        },
      };
    },
  },
};
