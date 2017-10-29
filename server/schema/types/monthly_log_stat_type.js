const graphql = require('graphql');

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLList,
} = graphql;

const MonthlyLogStatEvents = new GraphQLObjectType({
	name: 'MonthlyLogStatEvents',
	fields: () => ({
		event: { type: GraphQLString },
		count: { type: GraphQLInt },
	}),
});

const MonthlyLogStatSUB = new GraphQLObjectType({
	name: 'MonthlyLogStatSUB',
	fields: () => ({
		yearmonth: { type: GraphQLString },
		count: { type: GraphQLInt },
		events: { type: new GraphQLList(MonthlyLogStatEvents) },
	}),
});

const MonthlyLogStatType = new GraphQLObjectType({
	name: 'MonthlyLogStat',
	fields: () => ({
		service: { type: GraphQLString },
		count: { type: GraphQLInt },
		stats: { type: new GraphQLList(MonthlyLogStatSUB) },
	}),
});

module.exports = MonthlyLogStatType;
