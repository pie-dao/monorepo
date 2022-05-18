module.exports = {
  locales: ['en'],
  defaultLocale: 'en',
  localeDetection: false,
  pages: {
    '*': ['common'],
  },
  interpolation: {
    prefix: '${',
    suffix: '}',
  },
  defaultNS: 'common',
  loadLocaleFrom: (locale, namespace) =>
    import(`./public/locales/${locale}/${namespace}`).then((m) => m.default),
};
