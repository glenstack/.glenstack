import { handleRequest as graphql } from "./graphql";

addEventListener("fetch", (event) => {
  event.respondWith(handleEvent(event));
});

const handleEvent = async (event: FetchEvent): Promise<Response> => {
  const { request } = event;

  return await graphql(request);
};
