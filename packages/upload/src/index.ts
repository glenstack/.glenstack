import Toucan from "toucan-js";
import pkg from "../package.json";
import { uploadFile } from "./uploadFile";

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
    return await uploadFile(event.request);
  } catch (error) {
    sentry.captureException(error);
    // TODO: Nice error page
    return new Response("Internal Error", { status: 500 });
  }
};
