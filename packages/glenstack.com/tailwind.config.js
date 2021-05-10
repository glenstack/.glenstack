const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        yellow: {
          DEFAULT: "#FFB800",
          50: "#FFF8E5",
          100: "#FFF1CC",
          200: "#FFE399",
          300: "#FFD466",
          400: "#FFC633",
          500: "#FFB800",
          600: "#CC9300",
          700: "#996E00",
          800: "#664A00",
          900: "#332500",
        },
        rose: {
          DEFAULT: "#FF007A",
          50: "#FFE5F2",
          100: "#FFCCE4",
          200: "#FF99CA",
          300: "#FF66AF",
          400: "#FF3395",
          500: "#FF007A",
          600: "#CC0062",
          700: "#990049",
          800: "#660031",
          900: "#330018",
        },
        indigo: {
          DEFAULT: "#5E76B2",
          50: "#F9FAFC",
          100: "#E8EBF4",
          200: "#C6CEE4",
          300: "#A3B1D3",
          400: "#8193C3",
          500: "#5E76B2",
          600: "#485E95",
          700: "#374873",
          800: "#273351",
          900: "#161D2E",
        },
      },
      fontFamily: {
        sans: ["JostVariable", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
