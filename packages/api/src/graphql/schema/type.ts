import { client } from "../../data/fauna/client";
import { TableRespository } from "../../data/fauna/repositories";
import type { Resolvers } from "../__generated__/graphql";
import typeDefs from "./type.graphql";

export { typeDefs };
export const resolvers: Resolvers = {
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
};
