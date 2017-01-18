#!/usr/bin/env node

/**
 * Command line application that tests core database access routines.
 * Only for testing dbTools and dbAccess modules, not needed for production run.
 * @author Petr Kunc <petr_kunc@cz.ibm.com>
 */

const co = require('co');
const chalk = require('chalk');
const DB = require('../lib/dbTools.js');
const access = require('../lib/dbAccess.js');

require('dotenv').config({ path: '../.env' });

/**
 * Supporting functions
 */
function onerror(err) {
  // log any uncaught errors
  console.error(err.stack);
}

/**
 * Main App
 */
function* main() {
  console.log(chalk.blue('Program starting'));

  // Connect to the database 'logs'
  const dbLogs = yield co(DB.connectDb('logs')).catch(onerror);

  // Print all databases in Cloudant
  yield co(DB.printAllDatabases()).catch(onerror);

  // Print indexes in the database
  yield co(DB.printAllIndexes(dbLogs)).catch(onerror);

  // Test for using DB index for selected user
  // const activities = yield co(access.getActivity(dbLogs, 'steve.lievens@silvergreen.eu')).catch(onerror);

  // Test for using DB views for selected user
  // const activities = yield co(access.getUserActions(dbLogs, 'steve.lievens@silvergreen.eu')).catch(onerror);

  // Test for using DB views for all users
  const userActivities = yield co(access.getUserActions(dbLogs)).catch(onerror);

  // Print all obtained activities
  console.log(userActivities);

  // Print all obtained activities and do a simple formatting of the output
  console.log(chalk.green(`Found ${userActivities.length} documents`));
  for (let i = 0; i < userActivities.length; i += 1) {
    // console.log('  Doc object: %s', userActivities[i].object);
    console.log(`  ${userActivities[i].key} ... ${userActivities[i].value}`);
  }

  // Test for using DB views for all activities
  const ativitiesTypes = yield co(access.getActions(dbLogs)).catch(onerror);
  console.log(chalk.green(`Found ${ativitiesTypes.length} documents`));
  for (let i = 0; i < ativitiesTypes.length; i += 1) {
    console.log(`  ${ativitiesTypes[i].key} ... ${ativitiesTypes[i].value}`);
  }

  console.log(chalk.blue('Program ending.'));
}

co(main).catch(onerror);
