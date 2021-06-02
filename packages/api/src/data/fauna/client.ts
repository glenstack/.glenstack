import "cross-fetch/polyfill";
import { Client } from "faunadb";

export const getClient = (secret: string): Client =>
  new Client({
    secret,
    fetch: (requestInfo: RequestInfo, requestInit?: RequestInit) => {
      const signal = requestInit?.signal;
      delete requestInit?.signal;
      const abortPromise = new Promise<Response>((resolve, reject) => {
        if (signal) {
          console.warn(
            "Aborting a fetch is not yet supported in Cloudflare Workers."
          );
          signal.onabort = () =>
            reject(new Error("The operation was aborted."));
        }
      });
      return Promise.race([
        abortPromise,
        fetch(
          requestInfo as RequestInfo,
          requestInit as RequestInit | undefined
        ),
      ]);
    },
  });

export const client = getClient("fnAEI3aezIACAcwwrsWsIDvyHVRNnSFOSg1Yjz8T");
