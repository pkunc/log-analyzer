const graphql = require('graphql');

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLNonNull,
} = graphql;

// Temporary data type, just for graphiql test
const LogEntryType = new GraphQLObjectType({
	name: 'LogEntry',
	fields: () => ({
		_id: { type: new GraphQLNonNull(GraphQLID) },
		date: { type: GraphQLString },
		yearmonthdate: { type: GraphQLString },
		email: { type: GraphQLString },
		service: { type: GraphQLString },
		event: { type: GraphQLString },
		object: { type: GraphQLString },
		status: { type: GraphQLString },
	}),
});

module.exports = LogEntryType;
