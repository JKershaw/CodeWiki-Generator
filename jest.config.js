module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'lib/**/*.js',
    '!lib/**/*.test.js'
  ],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  verbose: true
};
