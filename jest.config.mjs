/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  clearMocks: true,

  // ✅ Enable Coverage
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',

  // ✅ Coverage Report Types
  coverageReporters: ['json', 'json-summary', 'text', 'lcov', 'clover'],

  // ✅ Load Environment Setup
  setupFiles: ['<rootDir>/jest.setup.js'],

  // ✅ Test Environment
  testEnvironment: 'node',

  // ✅ Verbose Output
  verbose: true,

  // ✅ NEW: Add JUnit Reporting (Fix GitHub showing 0 tests)
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './reports',
        outputName: 'junit.xml',
      },
    ],
  ],
};

export default config;
