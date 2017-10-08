const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LogEntrySchema = new Schema(
	{
		_id: {
			type: Schema.Types.ObjectId,
			required: false,
		},
		customerId: { type: String },
		userId: { type: String },
		date: { type: String },
		email: { type: String },
		event: { type: String },
		status: { type: String },
	},
	{ collection: 'logs' },
);

mongoose.model('logEntry', LogEntrySchema);
