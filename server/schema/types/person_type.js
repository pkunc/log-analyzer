const graphql = require('graphql');

const {
	GraphQLObjectType,
	GraphQLString,
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
	}),
});

module.exports = PersonType;
