const { join } = require('path');
const { createGlobPatternsForDependencies } = require('@nrwl/next/tailwind');

function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`;
    }
    return `rgb(var(${variable}) / ${opacityValue})`;
  };
}

module.exports = {
  content: [
    join(__dirname, './src/**/**/*.{js,jsx,ts,tsx}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        primary: withOpacityValue('--color-primary'),
        secondary: withOpacityValue('--color-secondary'),
        tertiary: withOpacityValue('--color-tertiary'),
        dark: withOpacityValue('--color-dark'),
        light: withOpacityValue('--color-light'),
        link: withOpacityValue('--color-link'),
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  presets: [require('../../../tailwind-workspace-preset')],
};
