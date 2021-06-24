import { capitalize } from "./../../utils";
import type { DocumentNode } from "graphql";
import type { Context } from "./../context";
import { toGlobalId } from "graphql-relay";
import { client } from "../../data/fauna/client";
import { ProjectRepository } from "./../../data/fauna/repositories";
import type { Resolvers } from "../__generated__/graphql";
import schema from "./project.graphql";

export const generateTypeDefs = async ({
  context,
}: {
  context: Context;
}): Promise<DocumentNode[]> => {
  const schemas = [schema];

  return schemas;
};

export const generateResolvers = async ({
  context,
}: {
  context: Context;
}): Promise<Resolvers[]> => {
  const resolvers: Resolvers[] = [
    {
      Mutation: {
        createProject: async (parent, { input }) => {
          const projectRepository = new ProjectRepository(client);
          const id = await projectRepository.create({
            organizationId: input.organizationId,
            apiName: input.identifier,
            name: input.name,
          });

          const projectType = capitalize(`${input.identifier}Project`);
          const organizationIdentifier = "acme"; // TODO
          const organizationType = capitalize(
            `${organizationIdentifier}Organization`
          );

          return {
            project: {
              id: toGlobalId(`${organizationType}${projectType}`, id),
            },
          };
        },
      },
    },
  ];

  return resolvers;
};
