const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL;

mongoose.Promise = global.Promise;

const DbConnection = mongoose.connect(MONGO_URL, { useMongoClient: true });

mongoose.connection
	.once('open', () => console.log('Mongoose connected.'))
	.on('error', error => console.log('Mongoose connections error:', error))
	.on('disconnected', () => console.log('Mongoose disconnected.'));

/*
process.on('SIGINT', () => {
	mongoose.connection.close(() => {
		console.log('Mongoose disconnected through app termination.');
	});
});
*/

module.exports = DbConnection;
