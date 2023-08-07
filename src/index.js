const { loadAndGenerateSchema, saveAsFiles, saveAsPostman } = require('./io');
const { parseSchema } = require('./parsers');

const main = async ({
  schemaFilePath,
  destDirPath,
  collectionName,
  rawUrl,
  apiKey,
  generatePostmanOnly = 'false',
  useVariables = 'false',
  maxDepth = 10,
  encoding = 'utf-8',
  assumeValidSDL = 'true',
}) => {
  const gqlSchema = loadAndGenerateSchema(schemaFilePath, encoding, JSON.parse(assumeValidSDL));

  const parsedSchema = await parseSchema(gqlSchema, JSON.parse(useVariables), maxDepth);

  if (!JSON.parse(generatePostmanOnly)) saveAsFiles(destDirPath, parsedSchema);

  if (JSON.parse(generatePostmanOnly) && (!collectionName || !rawUrl))
    console.warn(
      '--generatePostmanOnly was set to true but no valid --collectionName or --rawUrl where provided',
    );

  if (collectionName && rawUrl)
    saveAsPostman(destDirPath, parsedSchema, collectionName, rawUrl, apiKey);
};

module.exports = {
  main,
};
