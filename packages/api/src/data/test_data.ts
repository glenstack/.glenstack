import { ApolloServer } from "apollo-server";

import { getSchema } from "./index";
import { GraphQLSchema } from "graphql";
import { client } from "./fauna/client";
getSchema(client).then((schema: GraphQLSchema) => {
  const server = new ApolloServer({
    schema,
  });
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
});
