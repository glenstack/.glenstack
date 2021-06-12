import { client } from "../../data/fauna/client";
import { OrganizationRepository } from "../../data/fauna/repositories";
import type { Resolvers } from "../__generated__/graphql";
import typeDefs from "./organization.graphql";

export { typeDefs };
export const resolvers: Resolvers = {
  Mutation: {
    createOrganization: async (parent, { input }, context, info) => {
      const organizationRepository = new OrganizationRepository(client);
      const id = await organizationRepository.create({
        name: input.name,
        apiName: input.identifier,
      });
      return {
        organization: {
          id,
        },
      };
    },
  },
  Organization: {
    __resolveType: ({ id }) => null,
    name: ({ id }) => "TEST",
  },
};
