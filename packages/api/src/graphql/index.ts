import { schema } from "./schema";
import { makeGraphQLHandler } from "@glenstack/cf-workers-graphql";

export const handleRequest = makeGraphQLHandler(schema, {
  makeErrorResponse: async (request, error) =>
    new Response(
      JSON.stringify({ message: error.message, stack: error.stack }),
      { headers: { "Content-Type": "application/json" } }
    ),
});
