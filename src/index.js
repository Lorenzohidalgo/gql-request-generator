const { loadAndGenerateSchema, saveAsFiles, saveAsPostman } = require('./io');
const { parseSchema } = require('./parsers');

const main = async ({
  schemaFilePath,
  destDirPath,
  collectionName,
  rawUrl,
  useVariables = 'false',
  maxDepth = 10,
  encoding = 'utf-8',
  assumeValidSDL = 'true',
}) => {
  const gqlSchema = loadAndGenerateSchema(schemaFilePath, encoding, JSON.parse(assumeValidSDL));

  const parsedSchema = await parseSchema(gqlSchema, JSON.parse(useVariables), maxDepth);

  saveAsFiles(destDirPath, parsedSchema);

  saveAsPostman(destDirPath, parsedSchema, collectionName, rawUrl);
};

module.exports = {
  main,
};