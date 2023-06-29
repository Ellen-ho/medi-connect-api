/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/migrations/',
    'ormconfig-cli.ts',
    '.*/tests/(.*/)*.+.ts$',
    '/.*.integration.test.ts$/',
  ],
};