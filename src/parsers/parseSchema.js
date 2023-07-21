const { formatter } = require("../formatter");
const { buildOperation } = require("./helpers/buildOperation");
const { MUTATION, QUERY, SUBSCRIPTION } = require("./helpers/wrappers");

const mapOperation = async (operationName, raw) => {
  const operation = await formatter(raw);
  return { operationName, operation };
};

const parseOperations = (gqlSchema, operationType, wrapper, maxDepth) => {
  const operationFields = operationType.getFields();
  return Object.keys(operationFields).map((opName) => {
    const raw = wrapper(opName, buildOperation(gqlSchema, operationFields[opName], maxDepth));
    return mapOperation(opName, raw);
  });
};

const parseSchema = async (gqlSchema, maxDepth) => {
  const parsedSchema = {};
  if (gqlSchema.getMutationType()) {
    parsedSchema.mutations = await Promise.all(
      parseOperations(gqlSchema, gqlSchema.getMutationType(), MUTATION, maxDepth)
    );
  } else {
    console.warn("No mutation type found in your schema");
  }

  if (gqlSchema.getQueryType()) {
    parsedSchema.queries = await Promise.all(
      parseOperations(gqlSchema, gqlSchema.getQueryType(), QUERY, maxDepth)
    );
  } else {
    console.warn("No queries type found in your schema");
  }

  if (gqlSchema.getSubscriptionType()) {
    parsedSchema.subscriptions = await Promise.all(
      parseOperations(gqlSchema, gqlSchema.getSubscriptionType(), SUBSCRIPTION, maxDepth)
    );
  } else {
    console.warn("No subscriptions type found in your schema");
  }

  return parsedSchema;
};

module.exports = {
  parseSchema,
};
