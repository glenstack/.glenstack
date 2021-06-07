import { ApolloServer } from "apollo-server";

import { getProjectSchema } from "./index";
import { GraphQLSchema } from "graphql";
import { client } from "./fauna/client";
getProjectSchema(client, "298779392931267073").then((schema: GraphQLSchema) => {
  const server = new ApolloServer({
    schema,
    cors: {
      origin: "*",
    },
  });
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
});
