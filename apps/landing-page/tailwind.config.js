const { join } = require('path');
const defaultTheme = require('tailwindcss/defaultTheme');
const { createGlobPatternsForDependencies } = require('@nrwl/next/tailwind');

module.exports = {
  content: [
    join(__dirname, './pages/**/*.{js,ts,jsx,tsx}'),
    join(__dirname, './components/**/*.{js,ts,jsx,tsx}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        primary: '#150110',
        secondary: '#412D87',
        highlight: '#D7099C',
        highlight_secondary: '#32C7FE',
        deep_blue: '#367BF5',
        deep_purple: '#9388DB',
        deeper_purple: '#412D87',
        light_blue: '#28D2FF',
        light_green: '#2DFF1B',
      },
      fontFamily: {
        sans: ['Rubik', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  presets: [require('../../tailwind-workspace-preset.js')],
};
