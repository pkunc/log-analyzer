const mongoose = require('mongoose');
const graphql = require('graphql');
const moment = require('moment');

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
const MonthlyLogStatType = require('./monthly_log_stat_type');

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
				// console.log('[RootQuery.events] Events: ', parentValue, args);
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

		montlyLogStats: {
			type: new GraphQLList(MonthlyLogStatType),
			args: { services: { type: new GraphQLList(GraphQLString) } },
			async resolve(parentValue, args) {
				// console.log('[RootQuery.montlyLogStats] montlyLogStats: ', parentValue, args);
				try {
					const result = await LogEntry.aggregate([
						// { $match: { service } },
						{ $match: { service: { $in: args.services } } },
						{ $project: { yearmonth: { $substr: ['$date', 0, 7] }, service: '$service', event: '$event' } },
						{
							$group: {
								_id: { yearmonth: '$yearmonth', service: '$service', event: '$event' },
								count: { $sum: 1 },
							},
						},
						{ $sort: { '_id.event': 1 } },
						{
							$group: {
								_id: { yearmonth: '$_id.yearmonth', service: '$_id.service' },
								events: { $push: { event: '$_id.event', count: '$count' } },
								count: { $sum: '$count' },
							},
						},
						{ $sort: { '_id.yearmonth': 1 } },
						{
							$group: {
								_id: { service: '$_id.service' },
								stats: { $push: { yearmonth: '$_id.yearmonth', events: '$events', count: '$count' } },
								count: { $sum: '$count' },
							},
						},
						{ $sort: { '_id.service': 1 } },
						{ $project: { service: '$_id.service', stats: 1, count: 1, _id: 0 } },
					]).exec();
					console.log(JSON.stringify(result, null, 4));
					return (result);
				} catch (err) {
					console.log('[RootQuery.montlyLogStats] ERROR while resolving query montlyLogStats.');
					throw err;
				}
			},
		},

		serviceIntervalStats: {
			type: new GraphQLList(EventType),
			args: {
				services: { type: new GraphQLList(GraphQLString) },
				startDate: { type: GraphQLString },
				endDate: { type: GraphQLString },
			},
			async resolve(parentValue, args) {
				// console.log('[RootQuery.serviceIntervalStats] serviceIntervalStats: ', parentValue, args);

				// If "services" argumet is missing set a deafult one
				const services = (args.services) ? args.services : ['AUTH'];

				const now = new Date();
				const today = moment(now).format('YYYY-MM-DD');
				const nowMinusMonth = moment(now).subtract(10, 'months');
				const monthAgo = nowMinusMonth.format('YYYY-MM-DD');

				// If "startDate" / "endDate" argumet is missing set a deafult one
				const startDate = (args.startDate) ? args.startDate : monthAgo;
				const endDate = (args.endDate) ? args.endDate : today;
				console.log(`StartDate: ${startDate}`);
				console.log(`EndDate: ${endDate}`);

				try {
					const result = await LogEntry.aggregate([
						{ $match: { service: { $in: services } } },
						{ $project: { yearmonthdate: { $substr: ['$date', 0, 10] }, service: '$service', event: '$event' } },
						{ $match: { yearmonthdate: { $gte: startDate } } },
						{ $match: { yearmonthdate: { $lte: endDate } } },
						{ $group: { _id: { service: '$service', event: '$event' }, total: { $sum: 1 } } },
						{ $project: { service: '$_id.service', event: '$_id.event', occurrences: '$total', _id: 0 } },
						{ $sort: { service: 1, event: 1 } },
					]).exec();

					console.log(`[RootQuery.serviceIntervalStats] Result of query serviceIntervalStats for services: "${services}"
					and between dates: ${startDate} - ${endDate}.`);
					console.log(result);
					return (result);
				} catch (err) {
					console.log(`[RootQuery.serviceIntervalStats] ERROR while resolving query serviceIntervalStats for services: "${services}"
					and between dates: ${startDate} - ${endDate}.`);
					throw err;
				}
			},
		},

		objects: {
			type: new GraphQLList(LogEntryType),
			args: {
				services: { type: new GraphQLList(GraphQLString) },
				events: { type: new GraphQLList(GraphQLString) },
				startDate: { type: GraphQLString },
				endDate: { type: GraphQLString },
			},
			async resolve(parentValue, args) {
				// console.log('[RootQuery.files] files: ', parentValue, args);

				// If "services" argumet is missing set a deafult one
				const services = (args.services) ? args.services : ['AUTH'];

				const now = new Date();
				const today = moment(now).format('YYYY-MM-DD');
				const nowMinusMonth = moment(now).subtract(10, 'months');
				const monthAgo = nowMinusMonth.format('YYYY-MM-DD');

				// If "startDate" / "endDate" argumet is missing set a deafult one
				const startDate = (args.startDate) ? args.startDate : monthAgo;
				const endDate = (args.endDate) ? args.endDate : today;
				console.log(`Services: ${services}`);
				console.log(`StartDate: ${startDate}`);
				console.log(`EndDate: ${endDate}`);

				try {
					let result;

					if (args.events && args.events.length > 0) {
						result = await LogEntry.aggregate([
							{ $match: { service: { $in: services } } },
							// the following filter is only if this aggregation sentence
							{ $match: { event: { $in: args.events } } },
							{ $project: { yearmonthdate: { $substr: ['$date', 0, 10] }, object: '$object', service: '$service', event: '$event', email: '$email', date: '$date' } },
							{ $match: { yearmonthdate: { $gte: startDate } } },
							{ $match: { yearmonthdate: { $lte: endDate } } },
							{ $group: { _id: { object: '$object', service: '$service', event: '$event', email: '$email', yearmonthdate: '$yearmonthdate' } } },
							{ $project: { object: '$_id.object', service: '$_id.service', event: '$_id.event', email: '$_id.email', yearmonthdate: '$_id.yearmonthdate', _id: 0 } },
							{ $sort: { yearmonthdate: 1, event: 1 } },
						]).exec();
					} else {
						result = await LogEntry.aggregate([
							{ $match: { service: { $in: services } } },
							{ $project: { yearmonthdate: { $substr: ['$date', 0, 10] }, object: '$object', service: '$service', event: '$event', email: '$email', date: '$date' } },
							{ $match: { yearmonthdate: { $gte: startDate } } },
							{ $match: { yearmonthdate: { $lte: endDate } } },
							{ $group: { _id: { object: '$object', service: '$service', event: '$event', email: '$email', yearmonthdate: '$yearmonthdate' } } },
							{ $project: { object: '$_id.object', service: '$_id.service', event: '$_id.event', email: '$_id.email', yearmonthdate: '$_id.yearmonthdate', _id: 0 } },
							{ $sort: { yearmonthdate: 1, event: 1 } },
						]).exec();
					}

					// const result = await LogEntry.aggregate([
					// 	{ $match: { service: 'FILES2' } },
					// 	{ $project: { yearmonthdate: { $substr: ['$date', 0, 10] }, object: '$object', event: '$event', email: '$email', date: '$date' } },
					// 	{ $match: { yearmonthdate: { $gte: startDate } } },
					// 	{ $match: { yearmonthdate: { $lte: endDate } } },
					// 	{ $group: { _id: { object: '$object', event: '$event', email: '$email', yearmonthdate: '$yearmonthdate' } } },
					// 	{ $project: { object: '$_id.object', event: '$_id.event', email: '$_id.email', yearmonthdate: '$_id.yearmonthdate', _id: 0 } },
					// 	{ $sort: { yearmonthdate: 1, event: 1 } },
					// ]).exec();

					console.log(`[RootQuery.files] Result of query files between dates: ${startDate} - ${endDate}.`);
					console.log(result);
					return (result);
				} catch (err) {
					console.log(`[RootQuery.files] ERROR while resolving query files between dates: ${startDate} - ${endDate}.`);
					throw err;
				}
			},
		},

	},
});

module.exports = RootQueryType;
