const express = require('express');
const cors = require('cors');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');
const DB = require('../lib/dbToolsM.js');

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

initDb();

// Enable CORS for all requets
app.use(cors());
// Instruct Express to pass on any request made to the '/graphql' route
// to the GraphQL instance.
app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true,
}));

// Webpack runs as a middleware.  If any request comes in for the root route ('/')
// Webpack will respond with the output of the webpack process: an HTML file and
// a single bundle.js output of all of our client side Javascript
const webpackMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');

// app.use(webpackMiddleware(webpack(webpackConfig)));

module.exports = app;
