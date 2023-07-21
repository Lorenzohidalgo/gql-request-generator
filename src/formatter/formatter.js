const { format } = require("prettier/standalone");
const gql = require("prettier/plugins/graphql");

const formatter = async (query) =>
  format(query, {
    parser: "graphql",
    plugins: [gql],
  });

module.exports = {
  formatter,
};
