const graphql = require('graphql');

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
} = graphql;

// Temporary data type, just for graphiql test
const EventType = new GraphQLObjectType({
	name: 'Event',
	fields: () => ({
		service: { type: GraphQLString },
		event: { type: GraphQLString },
		occurrences: { type: GraphQLInt },
	}),
});

module.exports = EventType;
