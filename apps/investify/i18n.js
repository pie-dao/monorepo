module.exports = {
  locales: ['en'],
  defaultLocale: 'en',
  localeDetection: false,
  pages: {
    '*': ['common', 'dashboard', 'notifications'],
    '/migration': ['migration', 'notifications'],
    '/migration/start': ['migration', 'notifications'],
    '/migration/veAUXO': ['migration', 'notifications'],
    '/migration/xAUXO': ['migration', 'notifications'],
  },
  interpolation: {
    prefix: '${',
    suffix: '}',
  },
  defaultNS: 'common',
  loadLocaleFrom: (locale, namespace) =>
    import(`./public/locales/${locale}/${namespace}`).then((m) => m.default),
};
