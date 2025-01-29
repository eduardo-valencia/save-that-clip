import { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  transform: { "^.+\\.ts?$": "ts-jest" },
  testEnvironment: "jest-environment-jsdom",
};

export default config;
