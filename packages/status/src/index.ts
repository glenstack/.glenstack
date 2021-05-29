import Toucan from "toucan-js";
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
  event.respondWith(handleRequest(event.request, sentry));
});

const handleRequest = async (
  request: Request,
  sentry: Toucan
): Promise<Response> => {
  try {
    const url = new URL(request.url);
    url.host = "09c7552b-8694-4d79-be52-9821ad05c79c.s.statusflare.com";
    request = new Request(url.toString(), request);
    return await fetch(request);
  } catch (error) {
    sentry.captureException(error);
    return new Response(null, {
      status: 302,
      headers: { Location: "https://glenstack.statusflare.app/" },
    });
  }
};
