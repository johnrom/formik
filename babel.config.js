const testConfig = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
};

module.exports = (api) => {
  return api.env('test') ? testConfig : {};
};
