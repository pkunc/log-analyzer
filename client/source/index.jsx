/**
 * Sample web application that displays data parsed from Connections Cloud
 * log files and stored into Cloudant.
 * @author Petr Kunc <petr_kunc@cz.ibm.com>
 */

import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

/*
// Workaround for Cloudant in browser
import { Querystring } from 'request/lib/querystring';

Querystring.prototype.unescape = function (val) {
  return unescape(val);
};
*/

import LogAnalyzer from './LogAnalyzer';

const client = new ApolloClient({
  // dataIdFromObject: o => o.id,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <LogAnalyzer />
  </ApolloProvider>,
  document.getElementById('appJSX'),
);
