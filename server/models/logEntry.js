const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LogEntrySchema = new Schema({
	// _id: {
	// 	type: Schema.Types.ObjectId,
	// 	required: false,
	// },
	customerId: { type: String },
	userId: { type: String },
	date: { type: String },
	status: { type: String },
});

mongoose.model('logEntry', LogEntrySchema);
// mongoose.model('logEntry', LogEntrySchema, 'logs');
