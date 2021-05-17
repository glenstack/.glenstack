export const applyCors = (response: Response): Response => {
  return new Response(response.body, {
    headers: {
      ...Object.fromEntries(response.headers.entries()),
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Origin":
        ENVIRONMENT === "development"
          ? "http://localhost:3000"
          : "https://glenstack.com",
      "Access-Control-Allow-Headers": "Content-Type",
    },
    status: response.status,
    statusText: response.statusText,
  });
};
