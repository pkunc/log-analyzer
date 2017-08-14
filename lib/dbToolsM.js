/**
 * Universal DB tools for MongoDB access
 * @author Petr Kunc <petr_kunc@cz.ibm.com>
 */

const chalk = require('chalk');
const MongoClient = require('mongodb').MongoClient;

/**
 * Connect to a database
 * @param {string} dbCollection - Name of the collection (e.g. "logs").
 * @returns {object} dbHandle to this database
 */
async function connectDb(dbCollection) {
  console.log('[db] Starting DB routines...');

  const MONGO_URL = process.env.MONGO_URL;
  // console.log(`[db] Connecting to server ${MONGO_URL}`);

  try {
    const db = await MongoClient.connect(MONGO_URL);
    console.log(`[db] Connected successfully to the database "${db.databaseName}"`);
    // console.log(db);
    const collection = db.collection(dbCollection);
    console.log(`[db] Opening collection "${collection.s.name}" in database "${collection.s.dbName}"`);
    return { db, collection };
  } catch (err) {
    console.log(chalk.red('[db] ERROR while opening the database'), err.message);
    throw err;
  }
}

module.exports.connectDb = connectDb;
