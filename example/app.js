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

  // Test for using DB index for all users
  const activities = yield co(access.getUserActions(dbLogs)).catch(onerror);

  // Print all obtained activities
  console.log(activities);

  // Print all obtained activities and do a simple formatting of the output
  try {
    console.log(chalk.green(`Found ${activities.length} documents`));
    for (let i = 0; i < activities.length; i += 1) {
      // console.log('  Doc object: %s', activities[i].object);
      console.log(`  Key: ${activities[i].key} ${activities[i].value}`);
    }
  } catch (err) {
    console.log(`ERROR: ${err.code}`);
    throw err;
  }

  console.log(chalk.blue('Program ending.'));
}

co(main).catch(onerror);
