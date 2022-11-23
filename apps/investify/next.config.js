// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx');
const nextTranslate = require('next-translate');

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  images: {
    domains: [
      'raw.githubusercontent.com',
      'static.tildacdn.com',
      '188.166.45.35', // CMS images
    ],
  },
  reactStrictMode: true,
};

module.exports = withNx(nextTranslate(nextConfig));
