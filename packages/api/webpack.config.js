const path = require("path");

module.exports = {
  output: {
    filename: `worker.js`,
    path: path.join(__dirname, "dist"),
  },
  mode: "production",
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      fs: path.resolve(__dirname, "./null.js"),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
};
