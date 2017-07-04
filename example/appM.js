#!/usr/bin/env node

/**
 * Command line application that tests core database access routines.
 * Only for testing dbTools and dbAccess modules, not needed for production run.
 * @author Petr Kunc <petr_kunc@cz.ibm.com>
 */

const co = require('co');
const chalk = require('chalk');
const DB = require('../lib/dbToolsM.js');

require('dotenv').config({ path: '../.env' });

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
function* main() {
  console.log(chalk.blue('Program starting'));

  // Connect to the database 'logs'
  const { db, collection } = yield* DB.connectDb('logs');
  console.log(`Got handler for database "${db.databaseName}" and collection "${collection.s.name}"`);

  // Write some documents in bulk
  const resultBulk = yield collection.bulkWrite([
    { insertOne:
      { document: { a: 1 } },
    },
    { insertOne:
      { document: { b: 1 } },
    },
    { insertOne:
      { document: { c: 1 } },
    },
  ], { ordered: true, w: 1 });
  console.log(`Inserted ${resultBulk.insertedCount} documents in bulk`);
  // console.log('Result of documents insert:');
  // console.log(resultBulk);

  // Write some documents using instertMany
  const resultMany = yield collection.insertMany([
    { x: 1 },
    { y: 1 },
    { z: 1 },
  ], { w: 1 });
  console.log(`Inserted ${resultMany.insertedCount} documents via insertMany`);
  // console.log('Result of insertMany:');
  // console.log(resultMany);

  // Read some documents from collections "logs"
  const docs = yield collection.find({}).limit(20).toArray();
  console.log('Document in collection:');
  console.log(docs);

  // Close database connection
  db.close();
  console.log(chalk.blue('Program ending.'));
}

co(main).catch(onerror);
