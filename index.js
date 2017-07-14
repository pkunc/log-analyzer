const graphqlLib = require('graphql');
const schema = require('./server/schema/schema');

const { graphql } = graphqlLib;

const app = require('./server/server');

app.listen(4000, () => {
  console.log('Listening on port 4000');

  // begin test example
  const query = `{
  logEntry(id: "ff") {
    id
    firstName
    age
  }
  }`;

  graphql(schema, query).then(res => res.data).then((res) => {
    console.log(res);
  });
  // end test example
});
