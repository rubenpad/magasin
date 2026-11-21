const config = {
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/*.spec.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "^@domain/(.*)$": "<rootDir>/src/find-closest-store/domain/$1",
    "^@infrastructure/(.*)$": "<rootDir>/src/find-closest-store/infrastructure/$1",
    "^@shared/(.*)$": "<rootDir>/src/shared/$1",
  },
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.spec.ts"],
  coverageReporters: ["text", "html"],
};

module.exports = config;
