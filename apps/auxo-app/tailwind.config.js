const colors = require('./src/tailwind/colors');
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    {
      pattern: /text-return-(100|80|60|40|20)/,
    },
  ],  
  theme: {
    fontFamily: {
      'primary': 'Rubik, sans-serif',
      'secondary': 'Roboto, monospace',
    },
    extend: {
      colors
    }
  },
  plugins: []
}