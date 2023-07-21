const { buildArgumentFields } = require('./buildArgumentFields');
const { buildRequestFields } = require('./buildRequestFields');

const buildOperation = (gqlSchema, operation, maxDepth) => {
  let queryStr = '';
  queryStr += `${operation.name} `;
  const inputArguments = operation.args
    .map((arg) => buildArgumentFields(gqlSchema, arg, maxDepth))
    .join('\n');
  if (inputArguments) queryStr += `(${inputArguments})`;

  const requestedFields = buildRequestFields(
    gqlSchema,
    operation.type?.ofType?.name ?? operation.type?.name,
    maxDepth,
  );
  queryStr += requestedFields;
  return queryStr;
};

module.exports = {
  buildOperation,
};
