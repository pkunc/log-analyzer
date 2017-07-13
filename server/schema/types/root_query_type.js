const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} = graphql;


// Temporary data type, just for graphiql test
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
  }),
});

// Temporary data type, just for graphiql test
const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        console.log('RootQuery User: ', parentValue, args);
        return 'sss';
      },
    },
  },
});

module.exports = RootQueryType;
