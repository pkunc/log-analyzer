const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} = graphql;

// Temporary data type, just for graphiql test
const LogEntryType = new GraphQLObjectType({
  name: 'LogEntry',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
  }),
});

module.exports = LogEntryType;
