import { waitlist } from "./waitlist";
import Toucan from "toucan-js";
import pkg from "../package.json";
import { gitHub } from "./external/gitHub";
import { redirectWithFlash } from "./utils";
import { signUp } from "./signUp";

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
    const { request } = event;
    const method = request.method.toUpperCase();
    const { pathname } = new URL(request.url);

    if (pathname === "/login/github" && method === "GET") {
      return gitHub.redirect();
    } else if (pathname === "/login/github/callback" && method === "GET") {
      return await gitHub.callback(request, sentry);
    } else if (pathname === "/signup" && method === "POST") {
      return await signUp(request, sentry);
    } else if (pathname === "/waitlist" && method === "POST") {
      return await waitlist(request, sentry);
    } else {
      return new Response(null, {
        status: 302,
        headers: { Location: "https://glenstack.com/login" },
      });
    }
  } catch (error) {
    sentry.captureException(error);
    return redirectWithFlash("https://glenstack.com/login", [
      {
        message:
          "An unexpected error has occurred. The Glenstack team has been notified.",
        category: "error",
      },
    ]);
  }
};
