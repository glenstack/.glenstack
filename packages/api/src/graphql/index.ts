import { makeGraphQLHandler } from "@glenstack/cf-workers-graphql";
import type Toucan from "toucan-js";
import { schema } from "../data";
import { makeContextValue } from "./context";

export const handleRequest = (
  request: Request,
  sentry: Toucan
): Promise<Response> =>
  makeGraphQLHandler(schema, {
    makeContextValue,
    makeErrorResponse: async (request, error) => {
      sentry.captureException(error);
      // TODO: Nice error page
      return new Response("Internal error", { status: 500 });
    },
  })(request);
