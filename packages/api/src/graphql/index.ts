import { schema } from "./schema";
import { makeGraphQLHandler } from "@glenstack/cf-workers-graphql";
import Toucan from "toucan-js";

export const handleRequest = (request: Request, sentry: Toucan) =>
  makeGraphQLHandler(schema, {
    makeErrorResponse: async (request, error) => {
      sentry.captureException(error);
      return new Response(
        JSON.stringify({ message: error.message, stack: error.stack }),
        { headers: { "Content-Type": "application/json" } }
      );
    },
  })(request);
