const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLString,
} = graphql;

const LogEntryType = require('./log_entry_type');

// Temporary data type, just for graphiql test
const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    logEntry: {
      type: LogEntryType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        console.log('RootQuery LogEntry: ', parentValue, args);
        // Sem prijde getActivity(user) ... jak ale vzresit async?
        return ({ id: args.id, args, firstName: 'sss', age: 20 });
      },
    },
  },
});

module.exports = RootQueryType;
