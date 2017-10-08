const graphql = require('graphql');

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
} = graphql;

// Temporary data type, just for graphiql test
const PersonType = new GraphQLObjectType({
	name: 'Person',
	fields: () => ({
		userId: { type: GraphQLString },
		customerId: { type: GraphQLString },
		email: { type: GraphQLString },
		firstLogin: { type: GraphQLString },
		lastLogin: { type: GraphQLString },
		numEntries: { type: GraphQLInt },
	}),
});

module.exports = PersonType;
