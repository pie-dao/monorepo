function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`;
    }
    return `rgb(var(${variable}) / ${opacityValue})`;
  };
}

module.exports = {
  content: ["./src/**/**/*.{js,jsx,ts,tsx}"],
  darkMode: "media", // or 'media' or 'class',
  theme: {
    extend: {
      colors: {
        primary: withOpacityValue("--color-primary"),
        secondary: withOpacityValue("--color-secondary"),
        tertiary: withOpacityValue("--color-tertiary"),
        dark: withOpacityValue("--color-dark"),
        light: withOpacityValue("--color-light"),
        link: withOpacityValue("--color-link"),
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
