import { toGlobalId } from "graphql-relay";
import type { DocumentNode } from "graphql";
import type { Context } from "./../context";
import { client } from "../../data/fauna/client";
import {
  RelationshipFieldRepository,
  ScalarFieldRepository,
} from "../../data/fauna/repositories";
import type { Resolvers } from "../__generated__/graphql";
import schema from "./property.graphql";
import { capitalize } from "../../utils";

export const generateTypeDefs = async ({
  context,
}: {
  context: Context;
}): Promise<DocumentNode[]> => {
  const schemas = [schema];

  return schemas;
};

export const resolvers = async ({
  context,
}: {
  context: Context;
}): Promise<Resolvers[]> => {
  const resolvers: Resolvers[] = [
    {
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

          const relationalPropertyType = capitalize(
            `${input.identifier}RelationalProperty`
          );
          const typeIdentifier = "";
          const typeType = capitalize(`${typeIdentifier}Type`);
          const projectIdentifier = "library";
          const projectType = capitalize(`${projectIdentifier}Project`);
          const organizationIdentifier = "acme";
          const organizationType = capitalize(
            `${organizationIdentifier}Organization`
          );

          return {
            property: {
              id: toGlobalId(
                `${organizationType}${projectType}${typeType}${relationalPropertyType}`,
                id
              ),
            },
          };
        },
      },
    },
  ];

  return resolvers;
};
