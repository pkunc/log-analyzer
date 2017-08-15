/**
 * Sample web application that displays data parsed from Connections Cloud
 * log files and stored into Cloudant.
 * @author Petr Kunc <petr_kunc@cz.ibm.com>
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

import App from './App';

const client = new ApolloClient({
  // dataIdFromObject: o => o.id,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('appJSX'),
);
