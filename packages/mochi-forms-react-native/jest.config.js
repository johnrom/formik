const baseConfig = require('../../jest.base');

module.exports = {
  ...baseConfig,
  globals: {
    ...(baseConfig.globals ?? {}),
    __DEV__: 'boolean',
  },
};
