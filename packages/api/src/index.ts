import Toucan from "toucan-js";
import { handleRequest as graphql } from "./graphql";
import pkg from "../package.json";

addEventListener("fetch", (event) => {
  const sentry = new Toucan({
    dsn: SENTRY_DSN,
    event,
    pkg,
    release: undefined,
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
  const { request } = event;
  return await graphql(request, sentry);
};
