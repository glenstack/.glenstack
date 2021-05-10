import faunadb from "faunadb";

export const client = new faunadb.Client({
  secret: FAUNA_ADMIN_KEY,
  fetch: (requestInfo, requestInit) => {
    const signal = requestInit?.signal;
    delete requestInit?.signal;
    const abortPromise = new Promise<Response>((resolve, reject) => {
      if (signal) {
        console.warn(
          "Aborting a fetch is not yet supported in Cloudflare Workers."
        );
        signal.onabort = () => reject(new Error("The operation was aborted."));
      }
    });
    return Promise.race([
      abortPromise,
      fetch(requestInfo as RequestInfo, requestInit as RequestInit | undefined),
    ]);
  },
});
