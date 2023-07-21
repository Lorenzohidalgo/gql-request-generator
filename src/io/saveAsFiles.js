const { mkdirSync, writeFileSync } = require('fs');
const { resolve, join } = require('path');

const createDir = (path) => {
  try {
    mkdirSync(path);
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
};

const saveFile = (destinationDirectory, outputFolder, fileName, contents) => {
  const writeFolder = join(destinationDirectory, `./${outputFolder}`);
  createDir(writeFolder);
  writeFileSync(join(writeFolder, `./${fileName}`), contents);
};

const saveAll = (destinationDirectory, outputFolder, operations) =>
  operations.forEach((operation) =>
    saveFile(
      destinationDirectory,
      outputFolder,
      `${operation.operationName}.graphql`,
      operation.operation,
    ),
  );

const saveAsFiles = (destinationDirectory, parsedSchema) => {
  if (!parsedSchema.mutations && !parsedSchema.queries && !parsedSchema.subscriptions) {
    console.error('No operations found to be saved');
    return;
  }

  createDir(destinationDirectory);

  if (parsedSchema.mutations) {
    saveAll(destinationDirectory, 'mutations', parsedSchema.mutations);
  }

  if (parsedSchema.queries) {
    saveAll(destinationDirectory, 'queries', parsedSchema.queries);
  }

  if (parsedSchema.subscriptions) {
    saveAll(destinationDirectory, 'subscriptions', parsedSchema.subscriptions);
  }
};

module.exports = {
  saveAsFiles,
};
