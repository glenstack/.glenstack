import { makeGraphQLHandler } from "@glenstack/cf-workers-graphql";
import type Toucan from "toucan-js";
import { schema } from "./schema";
import { makeContextValue } from "./context";

export const handleRequest = async (
  request: Request,
  sentry: Toucan
): Promise<Response> => {
  const context = await makeContextValue(request, sentry);
  return makeGraphQLHandler(await schema({ context }), {
    makeContextValue: async (request) => context,
    makeErrorResponse: async (request, error) => {
      sentry.captureException(error);
      // TODO: Nice error page
      return new Response("Internal error", { status: 500 });
    },
  })(request);
};
