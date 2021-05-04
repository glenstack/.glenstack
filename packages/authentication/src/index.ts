import Toucan from "toucan-js";
import { handleRequest as authentication } from "./authenticate";
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
  const { request } = event;
  return new Response("Hello, authentication service!");
};
