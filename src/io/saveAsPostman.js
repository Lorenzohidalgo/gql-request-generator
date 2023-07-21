const { Collection, ItemGroup, Item, Url } = require("postman-collection");

const { mkdirSync, writeFileSync } = require("fs");
const { resolve, join } = require("path");

const buildItemList = (operations, rawUrl) =>
  operations.map(
    (op) =>
      new Item({
        name: op.operationName,
        request: {
          method: "POST",
          url: Url.parse(rawUrl),
          body: {
            mode: "graphql",
            graphql: {
              query: op.operation,
              variables: "",
            },
          },
        },
      })
  );

const saveAsPostman = (
  destinationDirectory,
  parsedSchema,
  collectionName,
  rawUrl
) => {
  const newCollection = new Collection({
    info: {
      name: collectionName,
    },
  });

  if (parsedSchema.mutations) {
    newCollection.items.add(
      new ItemGroup({
        name: "mutations",
        item: buildItemList(parsedSchema.mutations, rawUrl),
      })
    );
  }

  if (parsedSchema.queries) {
    newCollection.items.add(
      new ItemGroup({
        name: "queries",
        item: buildItemList(parsedSchema.queries, rawUrl),
      })
    );
  }

  if (parsedSchema.subscriptions) {
    newCollection.items.add(
      new ItemGroup({
        name: "subscriptions",
        item: buildItemList(parsedSchema.subscriptions, rawUrl),
      })
    );
  }

  try {
    mkdirSync(resolve(destinationDirectory));
  } catch (err) {
    if (err.code !== "EEXIST") throw err;
  }

  writeFileSync(
    join(destinationDirectory, `./${collectionName}.postman_collection.json`),
    JSON.stringify(newCollection, null, 2)
  );
};

module.exports = {
  saveAsPostman,
};
