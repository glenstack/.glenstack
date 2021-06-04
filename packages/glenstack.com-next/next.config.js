const { EnvironmentPlugin } = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const withImages = require("next-images");
const { GitRevisionPlugin } = require("git-revision-webpack-plugin");

const gitRevisionPlugin = new GitRevisionPlugin();

// @ts-check
/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
module.exports = withImages({
  future: {
    webpack5: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.css$/,
      use: "raw-loader",
    });
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "node_modules/@fontsource/jost/files",
            to: "../public/files",
          },
        ],
      }),
      new EnvironmentPlugin({
        NEXT_PUBLIC_VERSION: JSON.stringify(gitRevisionPlugin.commithash()),
      })
    );

    return config;
  },
});
