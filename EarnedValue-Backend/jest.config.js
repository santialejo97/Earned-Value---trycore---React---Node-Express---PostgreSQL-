/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  clearMocks: true,
  watchman: false,
  collectCoverageFrom: [
    "src/controller/**/*.ts",
    "src/middleware/**/*.ts",
    "src/interfaces/**/*.ts",
    "!src/**/index.ts",
  ],
  coveragePathIgnorePatterns: ["/node_modules/"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFiles: ["<rootDir>/jest.setup.ts"],
};
