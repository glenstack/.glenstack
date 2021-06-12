import type { DocumentNode } from "graphql";
import type { Context } from "./../context";
import { client } from "../../data/fauna/client";
import { OrganizationRepository } from "../../data/fauna/repositories";
import type { Resolvers } from "../__generated__/graphql";
import schema from "./organization.graphql";

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
        createOrganization: async (parent, { input }) => {
          const organizationRepository = new OrganizationRepository(client);
          const id = await organizationRepository.create({
            apiName: input.identifier,
            name: input.name,
          });
          return {
            organization: {
              id,
            },
          };
        },
      },
    },
  ];

  return resolvers;
};
