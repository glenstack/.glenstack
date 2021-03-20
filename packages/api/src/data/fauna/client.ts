import faunadb from "faunadb";

export const client = new faunadb.Client({
  secret: "fnAEEMbV7JACBXz13uUH33hfoqHx2Md51caXK4-9"
  // fetch: (info: RequestInfo, init: RequestInit = {}): Promise<Response> => {
  //   const signal = init.signal;
  //   delete init.signal;
  //   const abortPromise = new Promise((resolve) => {
  //     if (signal) {
  //       signal.onabort = resolve;
  //     }
  //   });
  //   return Promise.race([abortPromise, fetch(info, init)]) as Promise<Response>;
  // },
});
