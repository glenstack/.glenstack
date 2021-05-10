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
    dsn: SENTRY_DSN_WORKER,
    event,
    pkg,
    release: VERSION,
    rewriteFrames: {
      root: "/",
    },
  });
  event.respondWith(handleEvent(event, sentry));
});

const redirect = async (status: number) =>
  new Response(null, {
    status: 302,
    headers: { Location: `/${status}` },
  });

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
      return await redirect(404);
    } else if (error instanceof MethodNotAllowedError) {
      return await redirect(405);
    }

    sentry.captureException(error);
    return await redirect(500);
  }
};
