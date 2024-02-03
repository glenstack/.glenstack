import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  displayName: "glenstack-com",
  collectCoverageFrom: ["pages/**/*"],
  coverageReporters: [["lcov", { projectRoot: "../.." }]],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.test.json",
    },
  },
};

export default config;
