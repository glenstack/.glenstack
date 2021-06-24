import express from "express";
import { express as voyagerMiddleware } from "graphql-voyager/middleware";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

app.use(
  "/graphql",
  createProxyMiddleware({
    target: "http://127.0.0.1:8787/graphql",
  })
);

app.use(
  "/",
  voyagerMiddleware({
    endpointUrl: "/graphql",
    displayOptions: { skipRelay: false },
  })
);

app.listen(3001);
