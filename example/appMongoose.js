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
*/
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

	// Fetch some data from Model using promises
	console.log('Will fetch some data:');
	await LogEntry.find({})
		.limit(10)
		.exec((err, results) => console.log(JSON.stringify(results, null, '\t')))
		.catch(err => console.log('Error while fetching entries: ', err));

	// Fetch some data from Model using async
	console.log('Will fetch some data:');
	try {
		const entries = await LogEntry.find({}).limit(10).exec();
		console.log(JSON.stringify(entries, null, '\t'));
	} catch (e) {
		onerror(e);
	}

	// Close database connection
	await db.close(() => console.log('Mongoose connection closed.'));
	console.log(chalk.blue('Program ending.'));
}

main();
