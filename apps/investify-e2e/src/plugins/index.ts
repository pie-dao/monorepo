module.exports = (on, config) => {
  return {
    ...config,
    baseUrl: process.env.CYPRESS_BASE_URL || config.baseUrl,
  };
};
