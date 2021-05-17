module.exports = {
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  jest: {
    configure: (jestConfig) => {
      jestConfig.displayName = "glenstack-com";
      jestConfig.coverageReporters = [["lcov", { projectRoot: "../.." }]];
      jestConfig.moduleNameMapper["\\.mdx$"] = "identity-obj-proxy";
      return jestConfig;
    },
  },
};
