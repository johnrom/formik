const testConfig = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: 'current' },
        shippedProposals: true,
      },
    ],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
};

const esmConfig = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: 'current' },
        shippedProposals: true,
      },
    ],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
};

module.exports = (api) => {
  return api.env('test') ? testConfig : esmConfig;
};
