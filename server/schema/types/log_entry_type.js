const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
} = graphql;

// Temporary data type, just for graphiql test
const LogEntryType = new GraphQLObjectType({
  name: 'LogEntry',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    date: { type: GraphQLString },
    email: { type: GraphQLString },
    event: { type: GraphQLString },
  }),
});

module.exports = LogEntryType;
