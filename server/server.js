const express = require('express');
const basicAuth = require('express-basic-auth');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');
const DB = require('../lib/dbToolsM.js');
const webpackConfig = require('../webpack.config.js');

const app = express();

async function initDb() {
	try {
		// console.log(`[initDb] Read .env credentials MONGO: ${JSON.stringify(process.env.MONGO_SERVICES)}`);
		const { db, collection } = await DB.connectDb('logs');
		console.log(`[initDb] Got handler for database "${db.databaseName}" and collection "${collection.s.name}"`);
		// console.log(`[initDb] Database handler: ${JSON.stringify(db)}`);
		global.DB = db;
		global.Logs = collection;
		// console.log(`[initDb] Set GLOBAL credentials DB: ${global.DB.databaseName}, ${global.Logs.s.name}`);
	} catch (e) {
		console.log(e);
	}
}

// Check whether MONGO_URL is correctly set.
// Either in .env (for local dev environment)
//		or in Bluemix Cloud Foundry application evironment variables
// Example: MONGO_URL = "mongodb://username:password@mongodb.acme.com:49382/logs"
require('dotenv').config({ path: './.env' });

if (!process.env.MONGO_URL) {
	console.log('Configuration settings MONGO_URL not found, exiting...');
	process.exit();
}

initDb();

function getUnauthorizedResponse(req) {
	return req.auth ?
		(`Credentials '${req.auth.user}:${req.auth.password} rejected`) :
		'No credentials provided';
}

// Enable CORS for all requets
app.use(cors());

// app.use(bodyParser.json());

// Instruct Express to pass on any request made to the '/graphql' route
// to the GraphQL instance.
app.use('/graphql', expressGraphQL({
	schema,
	graphiql: true,
}));

// Choose whether to only launch server part (production environment)
// or whether also rebuild client part in React (dev environment)
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
	console.log('Running in a PRODUCTION environment');
	// Enable simple authentication method to access the web application
	// username: logs, password: silvergreen
	app.use(basicAuth({
		users: { logs: 'silvergreen' },
		challenge: true,
		unauthorizedResponse: getUnauthorizedResponse,
	}));
	app.use(express.static('dist'));
} else {
	console.log('Running in a DEVELOPMENT environment');
	// Webpack runs as a middleware.	If any request comes in for the root route ('/')
	// Webpack will respond with the output of the webpack process: an HTML file and
	// a single bundle.js output of all of our client side Javascript
	app.use(webpackMiddleware(webpack(webpackConfig), { stats: { colors: true } }));
}

// Set that all other requests will return ../dist/index.html page
// This is for React-Router browser history
app.get('*', (request, response) => {
	response.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'));
});

module.exports = app;
