import { toGlobalId } from "graphql-relay";
import type { DocumentNode } from "graphql";
import type { Context } from "./../context";
import { client } from "../../data/fauna/client";
import { TableRespository } from "../../data/fauna/repositories";
import type { Resolvers } from "../__generated__/graphql";
import schema from "./type.graphql";
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
        createType: async (parent, { input }) => {
          const tableRepository = new TableRespository(client);
          const id = await tableRepository.create({
            projectId: input.projectId,
            apiName: input.identifier,
            name: input.name,
          });

          const typeType = capitalize(`${input.identifier}Type`);
          const projectIdentifier = `library`; // TODO
          const projectType = capitalize(`${projectIdentifier}Project`);
          const organizationIdentifier = `acme`; // TODO
          const organizationType = capitalize(
            `${organizationIdentifier}Organization`
          );

          return {
            type: {
              id: toGlobalId(
                `${organizationType}${projectType}${typeType}`,
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
