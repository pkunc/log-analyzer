const mongoose = require('mongoose');
const graphql = require('graphql');
require('../../models');

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLList,
} = graphql;

const LogEntryType = require('./log_entry_type');
const EventType = require('./event_type');
const PersonType = require('./person_type');

const LogEntry = mongoose.model('logEntry');

const RootQueryType = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {

		logEntry: {
			type: LogEntryType,
			args: { _id: { type: GraphQLID } },
			async resolve(parentValue, args) {
				// console.log('[RootQuery.logEntry] LogEntry: ', parentValue, args);
				try {
					const result = await LogEntry.findOne({ _id: args._id }).exec();
					console.log(`[RootQuery.logEntry] Result of query logEntry for ID="${args._id}":`);
					console.log(result);
					return (result);
				} catch (err) {
					console.log(`[RootQuery.logEntry] ERROR while resolving query logEntry for ID="${args._id}.`);
					throw err;
				}
			},
		},

		logEntries: {
			type: new GraphQLList(LogEntryType),
			args: { email: { type: GraphQLString } },
			async resolve(parentValue, args) {
				// console.log('[RootQuery.logEntries] LogEntries: ', parentValue, args);
				try {
					const result = await LogEntry.find({ email: args.email }).exec();
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
				// console.log('[RootQuery.persons] Events: ', parentValue, args);
				try {
					const result = await LogEntry.aggregate([
						{ $group: { _id: { service: '$service', event: '$event' }, total: { $sum: 1 } } },
						{ $project: { action: '$_id', total: '$total', _id: 0 } },
						{ $sort: { action: 1 } },
					]).exec();
					// console.log(result);
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

		person: {
			type: PersonType,
			args: { email: { type: GraphQLString } },
			async resolve(parentValue, args) {
				// console.log('[RootQuery.person] Person: ', parentValue, args);
				try {
					const result = await LogEntry.aggregate([
						{ $match: { email: args.email } },
						{ $group: { _id: '$email', userId: { $min: '$userid' }, customerId: { $min: '$customerid' }, firstLogin: { $min: '$date' }, lastLogin: { $max: '$date' }, count: { $sum: 1 } } },
						{ $project: { email: '$_id', userId: '$userId', customerId: '$customerId', firstLogin: '$firstLogin', lastLogin: '$lastLogin', numEntries: '$count', _id: 0 } },
					]).exec();
					console.log(`[RootQuery.person] Result of query person for user ${args.email}:`);
					console.log(result);
					return (result[0]);
				} catch (err) {
					console.log('[RootQuery.person] ERROR while resolving query person.');
					throw err;
				}
			},
		},

		persons: {
			type: new GraphQLList(PersonType),
			async resolve(parentValue, args) {
				// console.log('[RootQuery.persons] Persons: ', parentValue, args);
				try {
					const result = await LogEntry.aggregate([
						{ $group: { _id: '$email', userId: { $min: '$userid' }, customerId: { $min: '$customerid' }, firstLogin: { $min: '$date' }, lastLogin: { $max: '$date' }, count: { $sum: 1 } } },
						{ $project: { email: '$_id', userId: '$userId', customerId: '$customerId', firstLogin: '$firstLogin', lastLogin: '$lastLogin', numEntries: '$count', _id: 0 } },
						{ $sort: { email: 1 } },
					]).exec();
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
