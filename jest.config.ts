import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  globals: {
    "ts-jest": {
      isolatedModules: true,
      tsconfig: "tsconfig.json",
    },
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

export default config;
