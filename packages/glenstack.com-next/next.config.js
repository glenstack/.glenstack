const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = {
  redirects: () => {
    return [
      {
        source: "/blog",
        destination: "/blog/how-we-re-building-glenstack",
        permanent: false,
      },
    ];
  },
  images: {
    loader: "custom",
  },
  productionBrowserSourceMaps: true,
  sentry: {
    disableServerWebpackPlugin: true,
    disableClientWebpackPlugin: true,
  },
};

module.exports = withSentryConfig(moduleExports);
