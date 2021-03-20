const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        rose: colors.rose,
      },
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      margin: {
        '100': '25rem',
        '120': '30rem',
        '128': '32rem',
        '136': '34rem',
        '152': '38rem',
        '156': '39rem',
        '176': '44rem',
        '232': '58rem',
        '280': '70rem',
      },
      scale: {
        '25': '.25',
        '-1': '-1',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
