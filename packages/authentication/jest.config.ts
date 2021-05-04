import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  displayName: "API",
  collectCoverageFrom: ["src/**/*"],
  coverageReporters: [["lcov", { projectRoot: "../.." }]],
};

export default config;
