import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  displayName: "authentication",
  collectCoverageFrom: ["src/**/*"],
  coverageReporters: [["lcov", { projectRoot: "../.." }]],
};

export default config;
