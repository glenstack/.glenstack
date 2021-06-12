import type { DocumentNode } from "graphql";
import type { Context } from "./../context";
import { client } from "../../data/fauna/client";
import { TableRespository } from "../../data/fauna/repositories";
import type { Resolvers } from "../__generated__/graphql";
import schema from "./type.graphql";

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
        createType: async (parent, { input }) => {
          const tableRepository = new TableRespository(client);
          const id = await tableRepository.create({
            projectId: input.projectId,
            apiName: input.identifier,
            name: input.name,
          });
          return {
            type: {
              id,
            },
          };
        },
      },
    },
  ];

  return resolvers;
};
