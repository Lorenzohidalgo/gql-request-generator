const { saveAsPostman } = require("../../../src/io/saveAsPostman");

jest.mock("fs", () => ({
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

describe("Test handler.js", () => {
  test("test1", async () => {
    const parsedSchema = {
      mutations: [{ operationName: "operationName", operation: "operation" }],
      queries: [{ operationName: "operationName", operation: "operation" }],
      subscriptions: [
        { operationName: "operationName", operation: "operation" },
      ],
    };

    saveAsPostman(
      "./outDir",
      parsedSchema,
      "collectionName",
      "https://my-appsync.url.com/graphql"
    );
  });
});
