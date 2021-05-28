import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  displayName: "upload",
  collectCoverageFrom: ["src/**/*"],
  coverageReporters: [["lcov", { projectRoot: "../.." }]],
};

export default config;
