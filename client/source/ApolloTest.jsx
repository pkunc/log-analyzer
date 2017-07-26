import React from 'react';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import gql from 'graphql-tag';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'http://localhost:4000/graphql',
  }),
});

export default class ApolloTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: {},
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    const query = gql`
      {
        logEntry(_id: "595cd0c6560d561b570c4cb7") {
          _id
          date
          email
          event
        }
      }`;
    console.log(`[ApolloTest.fetchData] Will fetch data using GraphQL query`);
    const res = await client.query({ query });
    console.log(`[ApolloTest.fetchData] Fetched data: ${JSON.stringify(res)}`);
    const result = res.data.logEntry;
    console.log(`result: ${JSON.stringify(result)}`);
    this.setState({ result });
  }

  render() {
    console.log('Inside ApolloTest component');
    const query = gql`
      {
        logEntry(_id: "595cd0c6560d561b570c4cb7") {
          _id
          date
          email
          event
        }
      }`;

    client.query({ query })
    .then(res => res.data.logEntry)
    .then(data => console.log(data))
    .catch(error => console.error(error));

    return (
      <div>
        <h1>Apollo Client</h1>
        <div>Result event: { this.state.result.event }</div>
      </div>
    );
  }
}
