const { mkdirSync, writeFileSync } = require("fs");
const { resolve, join } = require("path");

const saveFile = (destinationDirectory, outputFolder, fileName, contents) => {
  const writeFolder = join(destinationDirectory, `./${outputFolder}`);
  try {
    mkdirSync(writeFolder);
  } catch (err) {
    if (err.code !== "EEXIST") throw err;
  }
  writeFileSync(join(writeFolder, `./${fileName}`), contents);
};

const saveAll = (destinationDirectory, outputFolder, operations) =>
  operations.forEach((operation) =>
    saveFile(
      destinationDirectory,
      outputFolder,
      `${operation.operationName}.graphql`,
      operation.operation
    )
  );

const saveAsFiles = (destinationDirectory, parsedSchema) => {
  try {
    mkdirSync(resolve(destinationDirectory));
  } catch (err) {
    if (err.code !== "EEXIST") throw err;
  }

  if (parsedSchema.mutations) {
    saveAll(destinationDirectory, "mutations", parsedSchema.mutations);
  }

  if (parsedSchema.queries) {
    saveAll(destinationDirectory, "queries", parsedSchema.queries);
  }

  if (parsedSchema.subscriptions) {
    saveAll(destinationDirectory, "subscriptions", parsedSchema.subscriptions);
  }
};

module.exports = {
  saveAsFiles,
};
