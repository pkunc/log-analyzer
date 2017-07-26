const { ObjectId } = require('mongodb');
const graphql = require('graphql');
const access = require('../../../lib/dbAccessM.js');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} = graphql;

const LogEntryType = require('./log_entry_type');

// Temporary data type, just for graphiql test
const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    logEntry: {
      type: LogEntryType,
      args: { _id: { type: GraphQLID } },
      async resolve(parentValue, args) {
        // console.log('[RootQuery.logEntry] LogEntry: ', parentValue, args);
        // console.log(`[RootQuery.logEntry] Read GLOBAL credentials DB: ${global.DB.databaseName}, ${global.Logs.s.name}`);
        /*
        const result = await global.Logs.find({ "_id": ObjectId(args._id) });
        console.log('[RootQuery.logEntry] Result of query logEntry:');
        console.log(result[0]);
        return (result[0]);
        */
        const result = await global.Logs.findOne({ _id: ObjectId(args._id) });
        console.log(`[RootQuery.logEntry] Result of query logEntry for ID="${args._id}":`);
        console.log(result);
        return (result);
      },
    },
    logEntries: {
      type: new GraphQLList(LogEntryType),
      args: { _id: { type: GraphQLID } },
      async resolve(parentValue, args) {
        // console.log('[RootQuery.logEntries] LogEntry: ', parentValue, args);
        // console.log(`[RootQuery.logEntries] Read GLOBAL credentials DB: ${global.DB.databaseName}, ${global.Logs.s.name}`);
        // const result = access.getActivity(global.Logs, args._id);
        try {
          const result = await global.Logs.find({ email: args._id }).toArray();
          console.log(`[RootQuery.logEntries] Result of query logEntries for user ${args._id}:`);
          console.log(result);
          return (result);
        } catch (err) {
          console.log(`[RootQuery.logEntries] ERROR while resolving query logEntries for user ${args._id}.`);
          throw err;
        }
      },
    },
  },
});

module.exports = RootQueryType;
