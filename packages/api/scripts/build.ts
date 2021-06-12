/// <reference types="node" />

import { build } from "esbuild";
import { execSync } from "child_process";
import graphqlLoaderPlugin from "@luckycatfactory/esbuild-graphql-loader";

build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  outfile: "dist/worker.js",
  format: "esm",
  minify: true,
  sourcemap: true,
  define: {
    VERSION: JSON.stringify(
      execSync("git rev-parse HEAD", { encoding: "utf-8" })
    ),
  },
  plugins: [graphqlLoaderPlugin()],
}).catch(() => {
  process.exit(1);
});
