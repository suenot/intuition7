import type { Config } from "@jest/types"

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  silent: false,
  automock: false, // jest.unmock('./path_to_module_to_be_unmocked');
}
export default config