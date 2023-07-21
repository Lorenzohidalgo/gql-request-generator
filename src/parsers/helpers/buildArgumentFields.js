const { GraphQLNonNull, GraphQLEnumType, GraphQLList } = require("graphql");

const getDefault = (field, fieldType) => {
  if (fieldType instanceof GraphQLEnumType) return fieldType.getValues()[0].value;

  switch (fieldType.name) {
    case "String":
      return `"${field.name}"`;
    case "Int":
    case "Float":
      return `1`;
    default:
      console.warn(`${fieldType.name} not yet supported`);
      return `"${fieldType.name}"`;
  }
};

const mapDefault = (field, fieldType) => {
  if (!(field.type instanceof GraphQLNonNull)) return "null";

  const fieldDefault = getDefault(field, fieldType);

  if (field.type.ofType instanceof GraphQLList) return `[ ${fieldDefault} ]`;

  return fieldDefault;
};

const buildType = (gqlSchema, argument, maxDepth, currDepth = 0) => {
  let queryStr = "";

  if (currDepth >= maxDepth) return queryStr;
  const currArgumentName = argument.type.toJSON().replace(/[[\]!]/g, "");
  const currArgumentType = gqlSchema.getType(currArgumentName);
  if (!currArgumentType.getFields) {
    return mapDefault(argument, currArgumentType);
  }

  const fields = currArgumentType.getFields();

  queryStr += "{\n";

  Object.keys(fields).forEach((fieldName) => {
    const field = fields[fieldName];
    const currTypeName = field.type.toJSON().replace(/[[\]!]/g, "");
    const fieldType = gqlSchema.getType(currTypeName);

    if (!fieldType.getFields) {
      queryStr += `${fieldName}: ${mapDefault(field, fieldType)}\n`;
      return;
    }

    const typeQuery = buildType(gqlSchema, field, maxDepth, currDepth + 1);

    if (field.type.ofType instanceof GraphQLList) {
      queryStr += `${fieldName}: [\n ${typeQuery}]\n`;
      return;
    }

    queryStr += `${fieldName}: ${typeQuery}\n`;
  });
  queryStr += "}";

  return queryStr;
};

const buildArgumentFields = (gqlSchema, argument, maxDepth) =>
  `${argument.name}: ${buildType(gqlSchema, argument, maxDepth)}`;

module.exports = {
  buildArgumentFields,
};
