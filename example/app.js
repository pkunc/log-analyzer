#!/usr/bin/env node

// 'use strict';

/**
 * Dependencies
 */
const co = require('co');
const DB = require('../lib/dbTools.js');
const access = require('../lib/dbAccess.js');

/**
 * Config
 */
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
  console.log('SYNC Program starting');

  // connect to the database
  const dbLogs = yield co(DB.connectDb('logs')).catch(onerror);

  // printDatabases
  yield co(DB.printAllDatabases()).catch(onerror);

  // printIndexes
  yield co(DB.printAllIndexes(dbLogs)).catch(onerror);

  // const activities = yield co(access.getActivity(dbLogs, 'steve.lievens@silvergreen.eu')).catch(onerror);
  // const activities = yield co(access.getUserActions(dbLogs, 'steve.lievens@silvergreen.eu')).catch(onerror);
  const activities = yield co(access.getUserActions(dbLogs)).catch(onerror);

  console.log(activities);

  try {
    console.log('Found %d documents with name', activities.length);
    for (let i = 0; i < activities.length; i += 1) {
      // console.log('  Doc object: %s', activities[i].object);
      console.log(`  Key: ${activities[i].key} ${activities[i].value}`);
    }
  } catch (err) {
    console.log(`ERROR: ${err.code}`);
    throw err;
  }

  console.log('SYNC Program stopping');
}

co(main).catch(onerror);
