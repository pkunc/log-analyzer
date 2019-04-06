const mongoose = require('mongoose');

const { Schema } = mongoose;

const LogEntrySchema = new Schema(
	{
		_id: {
			type: Schema.Types.ObjectId,
			required: false,
		},
		customerId: { type: String },
		userId: { type: String },
		date: { type: String },
		yearmonthdate: { type: String },
		email: { type: String },
		service: { type: String },
		event: { type: String },
		object: { type: String },
		status: { type: String },
	},
	{ collection: 'logs' },
);

mongoose.model('logEntry', LogEntrySchema);
