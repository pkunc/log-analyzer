#!/usr/bin/env node

// 'use strict';

/**
 * Dependencies
 */
const fs = require('fs');
const co = require('co');
// const promisify = require('es6-promisify');
const chalk = require('chalk');
const DB = require('../lib/dbTools.js');
const parse = require('../lib/parseTools.js');
const access = require('../lib/dbAccess.js');

/**
  * Config
  */
require('dotenv').config({ path: '../.env' });

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
  /* throw err; */
}

/**
 * Main App
 */
function* main() {
  console.log(chalk.blue('Program starting'));

  // connect to the database
  // const dbLogs = yield co(DB.connectDb('logs')).catch(onerror);
  const dbLogs = yield* DB.connectDb('logs');

  // create indexes
  // yield co(DB.createIndexes(dbLogs)).catch(onerror);
  yield* DB.createIndexes(dbLogs);

  // print indexes
  // yield co(DB.printAllIndexes(dbLogs)).catch(onerror);
  yield* DB.printAllIndexes(dbLogs);

  // create views
  // yield co(DB.createViews(dbLogs)).catch(onerror);
  yield* DB.createViews(dbLogs);

  // print views
  // yield co(DB.printViews(dbLogs)).catch(onerror);
  yield* DB.printViews(dbLogs);

  // set CORS
  // yield co(DB.setCORS()).catch(onerror);
  yield* DB.setCORS();

  // print CORS info
  // yield co(DB.printCORS()).catch(onerror);
  yield* DB.printCORS();

  // print databases
  // yield co(DB.printAllDatabases()).catch(onerror);
  yield* DB.printAllDatabases();

  // read log filenames into an array
  let totalInserted = 0;      // total number of objects sent to DB
  const logDir = './logs-small/';
  const files = fs.readdirSync(logDir);

  // parse each file in the array and insert into database

  for (const file of files) {
    const filePath = logDir + file;
    console.log(`[loop] Working on file ${filePath} which is type: ${parse.getLogType(filePath)}`);
    const rowsInserted = yield co(parse.parseLogFile(filePath, dbLogs)).catch(onerror);
    totalInserted += rowsInserted;
  }

  const activities = yield co(access.getActivity(dbLogs, 'steve.lievens@silvergreen.eu')).catch(onerror);
  console.log(activities);

  console.log(chalk.blue(`Program ending. Total objects inserted: ${totalInserted}`));
}

co(main).catch(onerror);
