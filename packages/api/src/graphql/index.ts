import { schema } from "./schema";
import { makeGraphQLHandler } from "@glenstack/cf-workers-graphql";
import type Toucan from "toucan-js";

export const handleRequest = (
  request: Request,
  sentry: Toucan
): Promise<Response> =>
  makeGraphQLHandler(schema, {
    makeErrorResponse: async (request, error) => {
      sentry.captureException(error);
      // TODO: Nice error page
      return new Response("Internal error", { status: 500 });
    },
  })(request);
