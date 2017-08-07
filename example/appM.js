#!/usr/bin/env node

/**
 * Command line application that tests core database access routines.
 * Only for testing dbTools and dbAccess modules, not needed for production run.
 * @author Petr Kunc <petr_kunc@cz.ibm.com>
 */

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
async function main() {
  console.log(chalk.blue('Program starting'));

  // Connect to the database and collection 'logs'
  const { db, collection } = await DB.connectDb('logs');
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
  const resultFind = await collection.find({}).limit(5).toArray();
  console.log('Documents in collection:');
  console.log(resultFind);

  // Get documents with selected "email" field
  // const resultFindSel = await collection.find({ email: 'steve.lievens@silvergreen.eu' }).limit(20).toArray();
  const resultFindSel = await access.getActivity(collection, 'steve.lievens@silvergreen.eu');
  console.log('Result of function getActivity:');
  console.log(resultFindSel);

  // Aggregate output - grouping by single field
  const resultAggrSimple = await collection.aggregate([
    { $group: { _id: '$service', total: { $sum: 1 } } },
    { $project: { service: '$_id', total: '$total', _id: 0 } },
  ]).toArray();
  console.log('Aggregated output grouping by single field:');
  console.log(resultAggrSimple);

  // Aggregate output - grouping by multiple fields
  const resultAggrMulti = await collection.aggregate([
    { $group: { _id: { service: '$service', email: '$email' }, total: { $sum: 1 } } },
    { $match: { } },
  ]).toArray();
  console.log('Aggregated output grouping by multiple fields:');
  console.log(resultAggrMulti);

  // Aggregate output - grouping by Actions
  const resultAggrAction = await access.getActions(collection);
  console.log('Result of function getActions:');
  console.log(resultAggrAction);

  // Aggregate output - grouping by email with min/max values
  try {
    const resultAggrMinMax = await access.getUserDate(collection);
    console.log('Result of function getUserDate:');
    console.log(resultAggrMinMax);
  } catch (e) {
    onerror(e);
  }

  // Aggregate output - prepare for PersonType
  const resultPersonType = await collection.aggregate([
    { $group: { _id: '$email', userId: { $min: '$userid' }, customerId: { $min: '$customerid' }, firstLogin: { $min: '$date' }, lastLogin: { $max: '$date' } } },
    { $project: { email: '$_id', userId: '$userId', customerId: '$customerId', firstLogin: '$firstLogin', lastLogin: '$lastLogin', _id: 0 } },
    { $sort: { email: 1 } },
  ]).toArray();
  console.log('Aggregated output - resultPersonType:');
  console.log(resultPersonType);

  // Close database connection
  db.close();
  console.log(chalk.blue('Program ending.'));
}

main();
