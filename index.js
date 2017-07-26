const graphqlLib = require('graphql');
const schema = require('./server/schema/schema');

const { graphql } = graphqlLib;

require('dotenv').config({ path: './.env' });

const app = require('./server/server');

app.listen(4000, () => {
  console.log('Listening on port 4000');

  // begin test example
  const query = `{
  logEntry(_id: "595cd0c6560d561b570c4cb7") {
    _id
    date
    email
    event
  }
  }`;

  graphql(schema, query).then(res => res.data).then((res) => {
    console.log(res);
  });
  // end test example
});
