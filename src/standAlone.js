#!/usr/bin/env node
const program = require('commander');
const { main } = require('./index');

program
  .option('--schemaFilePath [value]', 'path of your graphql schema file')
  .option(
    '--destDirPath [value]',
    'dir you want to store the generated queries and Postman Collection',
  )
  .option('--collectionName [value]', 'Name to use name the Postman Collection')
  .option('--rawUrl [value]', 'GraphQL API endpoint URL, used to generate the Postman Collection')
  .option('--maxDepth [value]', 'query depth you want to limit (The default is 10)', 10)
  .option('--useVariables [value]', 'Defines if variables should be used while generating the requests', 'true')
  .option('--encoding [value]', 'The encoding to use while reading the files (The default is utf-8)', 'utf-8')
  .option('--assumeValidSDL [value]', 'assume the SDL is valid (The default is true)', 'true')
  .parse();

const options = program.opts();

main({ ...options });
