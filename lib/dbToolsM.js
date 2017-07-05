/**
 * Universal DB tools for MongoDB access
 * @author Petr Kunc <petr_kunc@cz.ibm.com>
 */

const chalk = require('chalk');
const MongoClient = require('mongodb').MongoClient;

/**
 * Read MongoDB credentials from .env file
 * @returns {object} object with credentials to access Cloudant plus some config settings
 */
function getDbCredentials() {
  if (process.env.MONGO_SERVICES) {
    const env = JSON.parse(process.env.MONGO_SERVICES);
    const uri = env.mongoDB[0].uri;
    // console.log(`[ENV] Read .env credentials: ${JSON.stringify(uri)}`);
    return uri;
  }
  return undefined;
}

/**
 * Connect to a database
 * @param {string} dbCollection - Name of the collection (e.g. "logs").
 * @returns {object} dbHandle to this database
 */
function* connectDb(dbCollection) {
  console.log('[db] Starting DB routines...');

  const MONGO_URI = getDbCredentials();
  console.log(`[db] Connecting to server ${MONGO_URI}`);

  try {
    const db = yield MongoClient.connect(MONGO_URI);
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
