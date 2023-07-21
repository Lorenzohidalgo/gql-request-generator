#!/usr/bin/env node
const program = require('commander');
const { loadAndGenerateSchema, saveAsFiles, saveAsPostman } = require("./io");
const { parseSchema } = require("./parsers");

const main = async ({
  schemaFilePath,
  destDirPath,
  collectionName,
  rawUrl,
  maxDepth = 10,
  encoding = "utf-8",
  assumeValidSDL = true,
}) => {
  const gqlSchema = loadAndGenerateSchema(schemaFilePath, encoding, assumeValidSDL);

  const parsedSchema = await parseSchema(gqlSchema, maxDepth);

  saveAsFiles(destDirPath, parsedSchema);

  saveAsPostman(destDirPath, parsedSchema, collectionName, rawUrl);
};

module.exports = {
  main,
};

if (require.main === module) {
  program
    .option('--schemaFilePath [value]', 'path of your graphql schema file')
    .option('--destDirPath [value]', 'dir you want to store the generated queries and Postman Collection')
    .option('--collectionName [value]', 'Name to use name the Postman Collection')
    .option('--rawUrl [value]', 'GraphQL API endpoint URL, used to generate the Postman Collection')
    .option('--maxDepth [value]', 'query depth you want to limit (The default is 10)', 10)
    .option('--encoding [value]', 'assume the SDL is valid (The default is false)', "utf-8")
    .option('--assumeValidSDL [value]', 'extension file to use', true)
    .parse();
  const options = program.opts();
  return main({...options });
}
