const path = require('path')
module.exports = {
  core: {
    builder: 'webpack5'
  },
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-scss',
    {
     name: '@storybook/addon-postcss',
     options: {
       postcssLoaderOptions: {
         implementation: require('postcss'),
       },
     },
   },
  ],
  staticDirs: ['../public'],
}