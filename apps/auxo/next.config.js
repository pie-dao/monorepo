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
  typescript: {
    // !! WARN !!
    // ONLY FOR TESTING VERCEL BUILD IN DEVELOPMENT
    // DO NOT USE THIS IN PRODUCTION
    ignoreBuildErrors: true,
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/migration',
        permanent: false,
      },
      {
        source: '/xAUXO',
        destination: '/migration',
        permanent: false,
      },
      {
        source: '/veAUXO',
        destination: '/migration',
        permanent: false,
      },
      {
        source: '/vaults/:slug',
        destination: '/migration',
        permanent: false,
      },
    ];
  },
};

module.exports = withNx(nextTranslate(nextConfig));