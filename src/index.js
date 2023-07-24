const { loadAndGenerateSchema, saveAsFiles, saveAsPostman } = require('./io');
const { parseSchema } = require('./parsers');

const main = async ({
  schemaFilePath,
  destDirPath,
  collectionName,
  rawUrl,
  maxDepth = 10,
  encoding = 'utf-8',
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