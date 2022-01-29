const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
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
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
