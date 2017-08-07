import React from 'react';
import PropTypes from 'prop-types';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import LogEntriesQuery from './queries/LogEntriesQuery.gql';

/*
const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'http://localhost:4000/graphql',
  }),
});
*/
const client = new ApolloClient();

class ApolloTest extends React.Component {
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
    console.log('[ApolloTest.fetchData] Will fetch data using GraphQL query');
    const res = await client.query({ query });
    console.log(`[ApolloTest.fetchData] Fetched data: ${JSON.stringify(res)}`);
    const result = res.data.logEntry;
    // console.log(`result: ${JSON.stringify(result)}`);
    this.setState({ result });
  }

  renderResults() {
    return this.props.data.logEntries.map(({ _id, email, date, event }) => {
      return (
        <li key={_id}>
          <div>{_id}, {email}, {date}, {event}</div>
        </li>
      );
    });
  }

  render() {
    /*
    // Test inline query, log result to console only
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
    */

    console.log(`[ApolloTest] Data via Apollo Provider (this.props.data): ${JSON.stringify(this.props.data.logEntries)}`);

    if (this.props.data.loading) {
      return (
        <div>
          Loading...
        </div>
      );
    }
    return (
      <div>
        <h2>Apollo Client Test</h2>
        <div>Result obtained via <strong>direct Apollo Client Call</strong>: <br />
          _id: { this.state.result._id } <br />
          email: { this.state.result.email } <br />
          date: { this.state.result.date } <br />
          event: { this.state.result.event } <br />
        </div>
        <hr />
        <div>Result obtained via <strong>Apollo Provider and props.data</strong>:</div>
        <ul className="collection">
          {this.renderResults()}
        </ul>
      </div>
    );
  }
}

ApolloTest.propTypes = {
  data: PropTypes.object.isRequired,
};

export default graphql(LogEntriesQuery, {
  // options: (props) => { return { variables: { email: props.email } }; },
  options: props => ({ variables: { email: props.email } }),
})(ApolloTest);
