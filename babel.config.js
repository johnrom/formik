const esmConfig = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
};

module.exports = (api) => {
  return api.env('test') ? esmConfig : esmConfig;
};
