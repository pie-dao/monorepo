module.exports = {
  locales: ['en'],
  defaultLocale: 'en',
  localeDetection: false,
  pages: {
    '/': ['common'],
    '*': ['common', 'dashboard', 'notifications'],
    '/migration': ['migration'],
    '/migration/start': ['migration'],
    '/migration/ARV': ['migration'],
    '/migration/PRV': ['migration'],
  },
  interpolation: {
    prefix: '${',
    suffix: '}',
  },
  defaultNS: 'common',
  loadLocaleFrom: (locale, namespace) =>
    import(`./public/locales/${locale}/${namespace}`).then((m) => m.default),
};
