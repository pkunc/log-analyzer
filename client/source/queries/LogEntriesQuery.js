import gql from 'graphql-tag';

export default gql`
  query LogEntrieQuery($email: String) {
    logEntries(email: $email) {
      _id
      date
      email
      event
    }
  }
`;
