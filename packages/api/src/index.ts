import { applyCors } from "./cors";
import Toucan from "toucan-js";
import { handleRequest as graphql } from "./graphql";
import pkg from "../package.json";

addEventListener("fetch", (event) => {
  const sentry = new Toucan({
    dsn: SENTRY_DSN,
    event,
    pkg,
    release: VERSION,
    rewriteFrames: {
      root: "/",
    },
  });
  event.respondWith(handleEvent(event, sentry));
});

const handleEvent = async (
  event: FetchEvent,
  sentry: Toucan
): Promise<Response> => {
  try {
    switch (event.request.method.toLowerCase()) {
      case "options":
        return applyCors(new Response(null));
      default: {
        const { request } = event;
        const response = await graphql(request, sentry);
        return applyCors(response);
      }
    }
  } catch (error) {
    sentry.captureException(error);
    // TODO: Nice error page
    return new Response("Internal Error", { status: 500 });
  }
};
