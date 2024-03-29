/** @type {import('tailwindcss').Config} */
const { join } = require('path');
const { createGlobPatternsForDependencies } = require('@nrwl/next/tailwind');
const plugin = require('tailwindcss/plugin');

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
    join(__dirname, './pages/**/*.{js,ts,jsx,tsx}'),
    join(__dirname, './components/**/*.{js,ts,jsx,tsx}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      fontSize: {
        xs: ['.75rem', '1rem'],
        base: ['1rem', '1.25rem'],
      },
      fontFamily: {
        sans: ['Silka'],
      },
      colors: {
        primary: withOpacityValue('--color-primary'),
        secondary: withOpacityValue('--color-secondary'),
        tertiary: withOpacityValue('--color-tertiary'),
        text: withOpacityValue('--color-text'),
        'sub-light': withOpacityValue('--color-sub-light'),
        'sub-dark': withOpacityValue('--color-sub-dark'),
        cards: withOpacityValue('--color-cards'),
        background: withOpacityValue('--color-background'),
        'light-gray': withOpacityValue('--color-light-gray'),
        sidebar: withOpacityValue('--color-sidebar'),
        'custom-border': withOpacityValue('--color-custom-border'),
        success: withOpacityValue('--color-success'),
        warning: withOpacityValue('--color-warning'),
        error: withOpacityValue('--color-error'),
        info: withOpacityValue('--color-info'),
        red: withOpacityValue('--color-red'),
        green: withOpacityValue('--color-green'),
        purple: withOpacityValue('--color-purple'),
        violet: withOpacityValue('--color-violet'),
        yellow: withOpacityValue('--color-yellow'),
      },
      backgroundImage: {
        'gradient-primary': `linear-gradient(90deg, #FFFFFF 0.33%, #F6F7FF 95.86%)`,
        'gradient-primary-inverse': `linear-gradient(90deg, #F6F7FF 0.33%, #FFFFFF 95.86%)`,
        'gradient-overlay': `linear-gradient(
          0deg,
          rgba(11, 120, 221, 0.6) 0%,
          rgba(11, 120, 221, 0.6) 80%,
          rgba(11, 221, 145, 0.6) 100%
        );`,
        'dashboard-card': `url('/credit_card.png')`,
        'gradient-major-colors': `linear-gradient(
          90deg,
          rgb(var(--color-secondary)) 0%,
          rgb(var(--color-green)) 100%
        )`,
        'gradient-major-secondary-predominant': `linear-gradient(90deg, #0B78DD 53.18%, #0BDD91 129.01%)`,
      },
      keyframes: {
        'pulse-fast': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.2 },
        },
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss-radix'),
    require('@tailwindcss/container-queries'),
    plugin(function ({ addVariant }) {
      addVariant(
        'supports-scrollbars',
        '@supports selector(::-webkit-scrollbar)',
      );
      addVariant('scrollbar', '&::-webkit-scrollbar');
      addVariant('scrollbar-track', '&::-webkit-scrollbar-track');
      addVariant('scrollbar-thumb', '&::-webkit-scrollbar-thumb');
    }),
  ],
  presets: [require('../../tailwind-workspace-preset.js')],
};
