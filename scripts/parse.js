#!/usr/bin/env node

/**
 * Command line application that parses Connections Cloud logs
 * and pushes objects into Cloudant database.
 * @author Petr Kunc <petr_kunc@cz.ibm.com>
 */

const fs = require('fs');
const co = require('co');
const chalk = require('chalk');
const DB = require('../lib/dbTools.js');
const parse = require('../lib/parseTools.js');

require('dotenv').config({ path: '../.env' });

let dirName = '';		 // directory name from command line attributes
let doWritesBool = false; // true = save parsed data into db, false = just dry run, no inserd into db

/**
 * Supporting functions
 */
function onerror(err) {
	// log any uncaught errors in coroutines
	if (err.message) {
		console.log(chalk.red(`[onerror] ERROR message = "${err.message}"`));
	}
	if (err.stack) {
		console.log(chalk.red(`[onerror] ERROR stack = "${err.stack}"`));
	}
	if (err.error) {
		console.log(chalk.red(`[onerror] ERROR error = "${err.error}"`));
	}
	if (err.reason) {
		console.log(chalk.red(`[onerror] ERROR reason = "${err.reason}"`));
	}
	// throw err;
}

/**
 * Main App
 */
function* main() {
	console.log(chalk.blue('Program starting'));

	// connect to the database
	const dbLogs = yield* DB.connectDb('logs');

	// create indexes
	yield* DB.createIndexes(dbLogs);

	// print indexes
	yield* DB.printAllIndexes(dbLogs);

	// create views
	yield* DB.createViews(dbLogs);

	// print views
	yield* DB.printViews(dbLogs);

	// set CORS
	yield* DB.setCORS();

	// print CORS info
	yield* DB.printCORS();

	// print databases
	yield* DB.printAllDatabases();

	// read log filenames into an array
	let totalInserted = 0;			// total number of objects sent to DB
	const logDir = `./${dirName}/`;
	const files = fs.readdirSync(logDir);

	// parse each file in the array and insert into database
	for (const file of files) {
		const filePath = logDir + file;
		console.log(`[loop] Working on file ${filePath} which is type: ${parse.getLogType(filePath)}`);
		const rowsInserted = yield co(parse.parseLogFile(filePath, dbLogs, doWritesBool)).catch(onerror);
		totalInserted += rowsInserted;
	}

	console.log(chalk.blue(`Program ending. Total objects inserted: ${totalInserted}`));
}

const args = process.argv.slice(2);
dirName = args[0];
if (!dirName) {
	process.stdout.write('Please provide dir name as a parameter\n');
	process.stdout.write('Example: ./parse.js logs true\n');
	process.stdout.write('Exiting the process.\n');
	process.exit();
}
const doWrites = args[1];
if (!doWrites) {
	process.stdout.write('Please chose whether to save parsed data into database (true) or not (false)\n');
	process.stdout.write('Example: ./parse.js logs true\n');
	process.stdout.write('Exiting the process.\n');
	process.exit();
}
// convert string value to boolean
doWritesBool = doWrites === 'true';
console.log(`Will parse logs in "${dirName}" directory.`);

co(main).catch(onerror);
