const path = require('path');
const synpressPath = path.join(
  process.cwd(),
  '/node_modules/@synthetixio/synpress',
);

module.exports = {
  extends: [
    'plugin:cypress/recommended',
    '../../.eslintrc.json',
    `${synpressPath}/.eslintrc.js`,
  ],
  ignorePatterns: ['!**/*'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {},
    },
  ],
};
