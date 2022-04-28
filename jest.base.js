module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  moduleNameMapper: {
    '@mochi-forms/(.*)': '<rootDir>/../mochi-forms-$1/src',
  },
  roots: ['./test'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[jt]sx?$': [
      'babel-jest',
      { configFile: '../../babel.config.test.js' },
    ],
  },
};
