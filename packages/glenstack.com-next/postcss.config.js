const isProductionMode = process.env.NODE_ENV === "production";

module.exports = {
  plugins: {
    "postcss-import": {},
    tailwindcss: {},
    autoprefixer: {},
    ...(isProductionMode ? { cssnano: {} } : {}),
  },
};
