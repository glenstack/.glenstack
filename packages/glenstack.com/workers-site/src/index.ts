import Toucan from "toucan-js";
import {
  getAssetFromKV,
  MethodNotAllowedError,
  NotFoundError,
  serveSinglePageApp,
} from "@cloudflare/kv-asset-handler";
import pkg from "../package.json";

// https://github.com/cloudflare/kv-asset-handler/#cachecontrol
const cacheControl = undefined; // { bypassCache: true }

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

const handleException = async (
  event: FetchEvent,
  sentry: Toucan,
  status: number,
  statusText: string
) => {
  try {
    const response = await getAssetFromKV(event, {
      defaultMimeType: "text/html",
      mapRequestToAsset: (request) =>
        new Request(`${new URL(request.url).origin}/${status}.html`, request),
    });

    return new Response(response.body, { ...response, status });
  } catch (error) {
    sentry.captureMessage(`Failed to generate a ${status} response.`);
    sentry.captureException(error);
    return new Response(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${statusText} | Glenstack</title>
  </head>
  <body>
    <p>${statusText}, and an error has occurred. The Glenstack team have been alerted. Try going <a href="https://glenstack.com/">home</a>.</p>
  </body>
</html>
`);
  }
};

const handleEvent = async (event: FetchEvent, sentry: Toucan) => {
  const options: Parameters<typeof getAssetFromKV>[1] = {
    defaultMimeType: "text/html",
    mapRequestToAsset: serveSinglePageApp,
    cacheControl,
  };

  try {
    const page = await getAssetFromKV(event, options);
    const response = new Response(page.body, page);

    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Referrer-Policy", "unsafe-url");
    response.headers.set("Feature-Policy", "none");

    return response;
  } catch (error) {
    if (error instanceof NotFoundError) {
      return await handleException(event, sentry, 404, "Not found");
    } else if (error instanceof MethodNotAllowedError) {
      return await handleException(event, sentry, 405, "Method not allowed");
    }

    sentry.captureException(error);
    return await handleException(event, sentry, 500, "Internal error");
  }
};
