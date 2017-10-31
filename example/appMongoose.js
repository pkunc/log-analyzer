#!/usr/bin/env node

/**
 * Command line application that tests core database access routines.
 * Only for testing Mongoose procedures, not needed for production run.
 * @author Petr Kunc <petr_kunc@cz.ibm.com>
 */

const mongoose = require('mongoose');
const chalk = require('chalk');

require('dotenv').config({ path: '../.env' });
require('../server/models');

// Connect to the database 'logs'
const db = require('../lib/db.js');

/**
 * Supporting functions
 */
function onerror(err) {
	// log any uncaught errors
	console.log(chalk.red(`[onerror] ERROR message = "${err.message}"`));
	console.log(`[onerror] ERROR stack = "${err.stack}"`);
}

/**
 * Main App
 */
async function main() {
	console.log(chalk.blue('Program starting'));

	const LogEntry = mongoose.model('logEntry');
/*
	// Store some data into Model (=collection) using callbacks
	await LogEntry.create({
		customerId: 'Petr',
		userId: '123',
		date: 'monday',
		status: 'SUCCESS',
	}, (err, entry) => {
		if (!err) {
			console.log('New entry saved.');
			console.log(entry);
		} else {
			console.log('Error while creating new entry: ', err);
		}
	});

	// Store some data into Model (=collection) using promises
	await LogEntry.create({
		customerId: 'Pavel',
		userId: '123',
		date: 'monday',
		status: 'SUCCESS',
	}).then(entry => console.log(entry))
		.catch(err => console.log('Error while creating new entry: ', err));

	// Store some data into Model (=collection) using async
	try {
		const entry = await LogEntry.create({
			customerId: 'Jana',
			userId: '123',
			date: 'monday',
			status: 'SUCCESS',
		});
		console.log(entry);
	} catch (e) {
		onerror(e);
	}
*/

/*
	// Fetch some data from Model using promises
	console.log('Will fetch some data:');
	await LogEntry.find({})
		.limit(10)
		.exec((err, results) => console.log(JSON.stringify(results, null, '\t')))
		.catch(err => console.log('Error while fetching entries: ', err));


	// Fetch some data from Model using async
	console.log('Will fetch some data:');
	try {
		const result = await LogEntry.find({}).limit(10).exec();
		console.log(JSON.stringify(result, null, '\t'));
	} catch (e) {
		onerror(e);
	}
*/

/*
	// Prepare for Query resolver: logEntry(_id)
	console.log('Will fetch some data for logEntry:');
	try {
		const result = await LogEntry.findOne({ _id: '59c89746d6fecbd2d0845759' }).exec();
		console.log(JSON.stringify(result, null, '\t'));
	} catch (e) {
		onerror(e);
	}

	// Prepare for Query resolver: logEntries(email)
	console.log('Will fetch some data for logEntries:');
	try {
		const result = await LogEntry.find({ email: 'petr.kunc@silvergreen.eu' }).limit(10).exec();
		console.log(JSON.stringify(result, null, '\t'));
	} catch (e) {
		onerror(e);
	}

	// Prepare for Query resolver: events()
	console.log('Will fetch some data for events:');
	try {
		const result = await LogEntry.aggregate([
			{ $group: { _id: { service: '$service', event: '$event' }, total: { $sum: 1 } } },
			{ $project: { action: '$_id', total: '$total', _id: 0 } },
			{ $sort: { action: 1 } },
		]).exec();
		// console.log('Aggregated output - resultEventType:');
		// console.log(result);
		const flattenResult = result.map(({ action: { service, event }, total }) => ({ service, event, occurrences: total }));
		console.log(JSON.stringify(flattenResult, null, '\t'));
	} catch (e) {
		onerror(e);
	}

	// Prepare for Query resolver: person()
	console.log('Will fetch some data for person:');
	try {
		const result = await LogEntry.aggregate([
			{ $match: { email: 'petr.kunc@silvergreen.eu' } },
			{ $group: { _id: '$email', userId: { $min: '$userid' }, customerId: { $min: '$customerid' }, firstLogin: { $min: '$date' }, lastLogin: { $max: '$date' }, count: { $sum: 1 } } },
			{ $project: { email: '$_id', userId: '$userId', customerId: '$customerId', firstLogin: '$firstLogin', lastLogin: '$lastLogin', numEntries: '$count', _id: 0 } },
		]).exec();
		console.log('Aggregated output - resultEventType:');
		console.log(result[0]);
	} catch (e) {
		onerror(e);
	}

*/

	// Prepare for YearMonthCount aggregation for charts
	console.log('Will fetch some data for YearMonthCount Charts:');
	try {
		const result = await LogEntry.aggregate([
			{ $match: { service: { $in: ['FILES2', 'AUTH', 'WIKIS'] } } },
			{ $project: { yearmonth: { $substr: ['$date', 0, 7] }, service: '$service', event: '$event' } },
			{ $group: {
				_id: { yearmonth: '$yearmonth', service: '$service', event: '$event' },
				count: { $sum: 1 } },
			},
			{ $sort: { '_id.event': 1 } },
			{ $group: {
				_id: { yearmonth: '$_id.yearmonth', service: '$_id.service' },
				events: { $push: { event: '$_id.event', count: '$count' } },
				count: { $sum: '$count' },
			} },
			{ $sort: { '_id.yearmonth': 1 } },
			{ $group: {
				_id: { service: '$_id.service' },
				stats: { $push: { yearmonth: '$_id.yearmonth', events: '$events', count: '$count' } },
				count: { $sum: '$count' },
			} },
			{ $sort: { '_id.service': 1 } },
			{ $project: { service: '$_id.service', stats: 1, count: 1, _id: 0 } },
		]).limit(20).exec();
		console.log('Aggregated output - resultEventType:');
		console.log(JSON.stringify(result, null, 4));
	} catch (e) {
		onerror(e);
	}

	// Close database connection
	await db.close(() => console.log('Mongoose connection closed.'));
	console.log(chalk.blue('Program ending.'));
}

main();
