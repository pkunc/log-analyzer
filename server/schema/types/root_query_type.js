const { ObjectId } = require('mongodb');
const graphql = require('graphql');
// const access = require('../../../lib/dbAccessM.js');

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLList,
} = graphql;

const LogEntryType = require('./log_entry_type');
const EventType = require('./event_type');
const PersonType = require('./person_type');

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
			args: { email: { type: GraphQLString } },
			async resolve(parentValue, args) {
				// console.log('[RootQuery.logEntries] LogEntry: ', parentValue, args);
				// console.log(`[RootQuery.logEntries] Read GLOBAL credentials DB: ${global.DB.databaseName}, ${global.Logs.s.name}`);
				// const result = access.getActivity(global.Logs, args.email);
				try {
					const result = await global.Logs.find({ email: args.email }).toArray();
					console.log(`[RootQuery.logEntries] Result of query logEntries for user ${args.email}:`);
					console.log(result);
					return (result);
				} catch (err) {
					console.log(`[RootQuery.logEntries] ERROR while resolving query logEntries for user ${args.email}.`);
					throw err;
				}
			},
		},

		events: {
			type: new GraphQLList(EventType),
			async resolve(parentValue, args) {
				// console.log('[RootQuery.persons] LogEntry: ', parentValue, args);
				// console.log(`[RootQuery.persons] Read GLOBAL credentials DB: ${global.DB.databaseName}, ${global.Logs.s.name}`);
				// const result = access.getActivity(global.Logs, args.email);
				try {
					const result = await global.Logs.aggregate([
						{ $group: { _id: { service: '$service', event: '$event' }, total: { $sum: 1 } } },
						{ $project: { action: '$_id', total: '$total', _id: 0 } },
						{ $sort: { action: 1 } },
					]).toArray();
					// console.log('Aggregated output - resultEventType:');
					// console.log(resultEventType);
					const flattenResult = result.map(({ action: { service, event }, total }) => ({ service, event, occurrences: total }));
					console.log('[RootQuery.events] Result of query events:');
					console.log(flattenResult);
					return (flattenResult);
				} catch (err) {
					console.log('[RootQuery.persons] ERROR while resolving query persons.');
					throw err;
				}
			},
		},

		persons: {
			type: new GraphQLList(PersonType),
			async resolve(parentValue, args) {
				// console.log('[RootQuery.persons] LogEntry: ', parentValue, args);
				// console.log(`[RootQuery.persons] Read GLOBAL credentials DB: ${global.DB.databaseName}, ${global.Logs.s.name}`);
				// const result = access.getActivity(global.Logs, args.email);
				try {
					const result = await global.Logs.aggregate([
						{ $group: { _id: '$email', userId: { $min: '$userid' }, customerId: { $min: '$customerid' }, firstLogin: { $min: '$date' }, lastLogin: { $max: '$date' } } },
						{ $project: { email: '$_id', userId: '$userId', customerId: '$customerId', firstLogin: '$firstLogin', lastLogin: '$lastLogin', _id: 0 } },
						{ $sort: { email: 1 } },
					]).toArray();
					console.log('[RootQuery.persons] Result of query persons:');
					console.log(result);
					return (result);
				} catch (err) {
					console.log('[RootQuery.persons] ERROR while resolving query persons.');
					throw err;
				}
			},
		},

	},
});

module.exports = RootQueryType;
