#!/usr/bin/env node

/**
 * Command line application that tests core database access routines.
 * Only for testing dbTools and dbAccess modules, not needed for production run.
 * @author Petr Kunc <petr_kunc@cz.ibm.com>
 */

const co = require('co');
const chalk = require('chalk');
const DB = require('../lib/dbToolsM.js');
const access = require('../lib/dbAccessM.js');

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

  // Connect to the database and collection 'logs'
  const { db, collection } = yield* DB.connectDb('logs');
  console.log(`Got handler for database "${db.databaseName}" and collection "${collection.s.name}"`);

  /*
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
  */

  // Get all documents from collections "logs"
  const resultFind = yield collection.find({}).limit(20).toArray();
  console.log('All documents in collection:');
  // console.log(resultFind);

  // Get documents with selected "email" field
  // const resultFindSel = yield collection.find({ email: 'steve.lievens@silvergreen.eu' }).limit(20).toArray();
  const resultFindSel = yield access.getActivity(collection, 'steve.lievens@silvergreen.eu');
  console.log('Selected documents in collection:');
  console.log(resultFindSel);

  // Aggregate output - grouping by single field
  const resultAggrSimple = yield collection.aggregate([
    { $group: { _id: '$service', total: { $sum: 1 } } },
    { $project: { service: '$_id', total: '$total', _id: 0 } },
  ]).toArray();
  // console.log('Aggregated output:');
  // console.log(resultAggrSimple);

  // Aggregate output - grouping by multiple fields
  const resultAggrMulti = yield collection.aggregate([
    { $group: { _id: { service: '$service', email: '$email' }, total: { $sum: 1 } } },
    { $match: { } },
  ]).toArray();
  // console.log('Aggregated output:');
  // console.log(resultAggrMulti);

  // Aggregate output - grouping by Actions
  const resultAggrAction = yield access.getActions(collection);
  console.log('Aggregated output:');
  console.log(resultAggrAction);

  // Aggregate output - grouping by email with min/max values
  const resultAggrMinMax = yield access.getUserDate(collection);
  console.log('Aggregated output:');
  console.log(resultAggrMinMax);

  // Close database connection
  db.close();
  console.log(chalk.blue('Program ending.'));
}

co(main).catch(onerror);
