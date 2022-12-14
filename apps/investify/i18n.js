module.exports = {
  locales: ['en'],
  defaultLocale: 'en',
  localeDetection: false,
  pages: {
    '*': ['common', 'dashboard'],
    '/migration': ['migration'],
    '/migration/start': ['migration'],
    '/migration/veAUXO': ['migration'],
    '/migration/xAUXO': ['migration'],
  },
  interpolation: {
    prefix: '${',
    suffix: '}',
  },
  defaultNS: 'common',
  loadLocaleFrom: (locale, namespace) =>
    import(`./public/locales/${locale}/${namespace}`).then((m) => m.default),
};
