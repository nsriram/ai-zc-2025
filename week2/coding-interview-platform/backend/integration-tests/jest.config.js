export default {
  testEnvironment: 'node',
  testTimeout: 10000,
  verbose: true,
  maxWorkers: 1,
  collectCoverageFrom: [
    '../backend/**/*.js',
    '!../backend/node_modules/**'
  ],
  coverageDirectory: './coverage',
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ]
}