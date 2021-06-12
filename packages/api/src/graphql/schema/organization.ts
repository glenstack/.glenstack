import type { DocumentNode } from "graphql";
import { client } from "../../data/fauna/client";
import { OrganizationRepository } from "../../data/fauna/repositories";
import type { Resolvers } from "../__generated__/graphql";
import schema from "./organization.graphql";

export const generateTypeDefs = async (): Promise<DocumentNode[]> => [schema];

export const generateResolvers = async (): Promise<Resolvers> => ({
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
});
