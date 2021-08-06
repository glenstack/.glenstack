const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = {
  productionBrowserSourceMaps: true,
  sentry: {
    disableServerWebpackPlugin: true,
    disableClientWebpackPlugin: true,
  },
};

module.exports = withSentryConfig(moduleExports);
