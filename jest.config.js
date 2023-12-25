module.exports = {
  testTimeout: 15000,
  verbose: true,
  preset: "ts-jest",
  globalSetup: "./jest.global-setup.js",
  testEnvironment: "node",
  moduleFileExtensions: ["js", "json", "ts"],
  roots: ["src", "tests"],
  moduleDirectories: ["node_modules"],
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  moduleNameMapper: {
    "^src(.*)$": "<rootDir>/src/$1",
  },
  testRegex: "((\\.|/*.)(spec))\\.ts?$",
};
