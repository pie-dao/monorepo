const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        primary: "#150110",
        secondary: "#412D87",
        highlight: "#D7099C",
        highlight_secondary: "#32C7FE",
        deep_blue: "#367BF5",
        deep_purple: "#9388DB",
        deeper_purple: "#412D87",
        light_blue: "#28D2FF",
        light_green: "#2DFF1B",
      },
      fontFamily: {
        sans: ["Rubik", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
