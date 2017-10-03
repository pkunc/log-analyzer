/**
 * Universal DB tools for Cloudant access
 * @author Petr Kunc <petr_kunc@cz.ibm.com>
 */

const chalk = require('chalk');
const promisify = require('es6-promisify');
const Cloudant = require('cloudant');

/**
 * Read Cloudant credentials from .env file
 * @returns {object} object with credentials to access Cloudant plus some config settings
 */
function getDbCredentials() {
	if (process.env.VCAP_SERVICES) {
		const env = JSON.parse(process.env.VCAP_SERVICES);
		const credentials = env.cloudantNoSQLDB[0].credentials;
		// console.log(`[ENV] Read .env credentials: ${JSON.stringify(credentials)}`);
		return {
			account: credentials.username,
			password: credentials.password,
			// plugin: 'retry',
			plugin: 'promises',
			retryAttempts: 5,
			retryTimeout: 1000,
		};
	}
	return undefined;
}

/**
 * Connect to a database
 * @param {string} dnName - Name of the database (e.g. "logs").
 * @returns {object} dbHandle to this database
 */
function* connectDb(dbName) {
	console.log('[db] Starting DB routines...');

	const dbCredentials = getDbCredentials();
	const cloudant = Cloudant(dbCredentials);

	try {
		const dbInfo = yield cloudant.db.get(dbName);
		// const dbInfo = yield promisify(cloudant.db.get)(dbName);
		console.log(`[db.get] Database Info: db_name="${dbInfo.db_name}"`);
	} catch (err) {
		console.log(chalk.red(`[dbget] ERROR while getting info for database "${dbName}":`), err.message);
		console.log('[db.get] Database does not exist, creating a new one...');
		try {
			yield promisify(cloudant.db.create)(dbName);
			console.log(chalk.green(`[db.create] Database "${dbName}" created.`));
		} catch (err2) {
			console.log(chalk.red(`[db.create] ERROR while crating database "${dbName}":`), err.message);
			throw err2;
		}
	}

	console.log(`[db.get] database "${dbName}" exists and can be connected to`);

	// connect to required database and return the handle
	try {
		const dbHandle = cloudant.db.use(dbName);
		console.log(`[db.use] Connected to database: ${dbName}.`);
		return dbHandle;
	} catch (err) {
		console.log(`[db.use] ERROR while getting DB ${dbName} handle`);
		throw err;
	}
}

/**
 * Print all databases (just for test)
 */
function* printAllDatabases() {
	try {
		const dbCredentials = getDbCredentials();
		const cloudant = Cloudant(dbCredentials);

		// const allDbs = (yield promisify(cloudant.db.list))[0];
		const allDbs = (yield cloudant.db.list)[0];

		console.log('[db.list] All my databases: %s.', allDbs.join(', '));
	} catch (err) {
		console.log(chalk.red('[db.list] ERROR while getting DB list.'), err.message);
		throw err;
	}
}

/**
 * Create indexes in database
 * @param {object} db - dbhandle to the database.
 */
function* createIndexes(db) {
	const dateIndex = {
		name: 'date-index',
		type: 'json',
		index: {
			fields: ['date'],
		},
	};

	try {
		// const response = yield promisify(db.index)(dateIndex);
		const response = yield db.index(dateIndex);
		console.log(`[db.index] Index ${dateIndex.name} creation result: ${response.result}`);
	} catch (err) {
		console.log(chalk.red(`[db.index] ERROR while creating DB index ${dateIndex.name}.`), err.message);
		throw err;
	}

	const emailIndex = {
		name: 'email-index',
		type: 'json',
		index: {
			fields: ['email'],
		},
	};

	try {
		// const response = yield promisify(db.index)(emailIndex);
		const response = yield db.index(emailIndex);
		console.log(`[db.index] Index ${emailIndex.name} creation result: ${response.result}`);
	} catch (err) {
		console.log(chalk.red(`[db.index] ERROR while creating DB index ${emailIndex.name}.`), err.error, err.reason);
		throw err;
	}
}

/**
 * Print all indexes in the database (just for check)
 * @param {object} db - dbhandle to the database.
 */
function* printAllIndexes(db) {
	try {
		const result = yield promisify(db.index)();
		// const result = yield db.index();
		// console.log('RESULT', result);
		console.log('[db.index] The database has %d indexes:', result.indexes.length);
		for (let i = 0; i < result.indexes.length; i+= 1) {
			console.log('	%s (%s): %j', result.indexes[i].name, result.indexes[i].type, result.indexes[i].def);
		}
	} catch (err) {
		console.log(chalk.red('[db.index] ERROR while getting DB indexes.'), err.error, err.reason);
		throw err;
	}
}

/**
 * Set CORS to allow browser access
 */
function* setCORS() {
	try {
		const dbCredentials = getDbCredentials();
		const cloudant = Cloudant(dbCredentials);

		const corsSettings = {
			enable_cors: true,
			allow_credentials: true,
			origins: ['*'],
		};

		// const coSetCorsDbFind = promisify(cloudant.set_cors);
		// const result = (yield coSetCorsDbFind(corsSettings))[0];
		const result = yield cloudant.set_cors(corsSettings);

		console.log(`[db.cors] CORS was set to: ${JSON.stringify(corsSettings)} with result ${JSON.stringify(result)}`);
	} catch (err) {
		console.log(chalk.red('[db.cors] ERROR while setting CORS info.'), err.message);
		throw err;
	}
}

/**
 * Print Cloudant CORS settings
 */
function* printCORS() {
	try {
		const dbCredentials = getDbCredentials();
		const cloudant = Cloudant(dbCredentials);

		// const result = (yield promisify(cloudant.get_cors))[0];
		const result = (yield cloudant.get_cors)[0];

		console.log(`[db.cors] CORS settings are: ${JSON.stringify(result)}`);
	} catch (err) {
		console.log(chalk.red('[db.cors] ERROR while getting CORS info.'), err.message);
		throw err;
	}
}

/**
 * Create Cloudant design document for Views
 * @param {object} db - dbhandle to the database.
 */
function* createViews(db) {
	const views = [
		{
			_id: '_design/view-by-user',
			views: {
				'by-user': {
					reduce: '_count',
					map: 'function (doc) { emit(doc.email, 1); }',
				},
			},
			language: 'javascript',
		},
		{
			_id: '_design/view-by-event',
			views: {
				'by-event': {
					reduce: '_count',
					map: 'function (doc) { emit([doc.service, doc.event], 1); }',
				},
			},
			language: 'javascript',
		},
		{
			_id: '_design/view-by-user-date',
			views: {
				'by-user-date': {
					reduce: '_stats',
					map: `function (doc) {
						var year = doc.date.substring(0,4);
						var month = doc.date.substring(5,7);
						var day = doc.date.substring(8,10);
						fullDateNumber = parseInt(year + month + day);
						emit(doc.email, fullDateNumber);
					}`,
				},
			},
			language: 'javascript',
		},
	];

	for (const view of views) {
		try {
			/* eslint no-underscore-dangle: ["warn", { "allow": ["_id"] }] */
			console.log(`[db.views] View to create: ${view._id}`);
			const result = yield db.insert(view);
			console.log(chalk.green(`[db.views] View created: ${JSON.stringify(result)}`));
		} catch (err) {
			if (err.error === 'conflict') {
				console.log('[db.views] View already exists');
			} else {
				console.log(chalk.red('[db.views] ERROR while creating View.'), err.message);
				throw err;
			}
		}
	}
}

/**
 * Print Cloudant design document for Views
 * @param {object} db - dbhandle to the database.
 */
function* printViews(db) {
	try {
		const result = (yield db.get('_design/view-by-user')).views;

		console.log(`[db.views] Views are: ${JSON.stringify(result)}`);
	} catch (err) {
		console.log(chalk.red('[db.views] ERROR while getting Views info.'), err.message);
		throw err;
	}
}

module.exports.connectDb = connectDb;
module.exports.printAllDatabases = printAllDatabases;
module.exports.createIndexes = createIndexes;
module.exports.printAllIndexes = printAllIndexes;
module.exports.setCORS = setCORS;
module.exports.printCORS = printCORS;
module.exports.createViews = createViews;
module.exports.printViews = printViews;
