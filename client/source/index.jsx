// 'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

// Workaround for Cloudant in browser
import { Querystring } from 'request/lib/querystring';

Querystring.prototype.unescape = function (val) {
  return unescape(val);
};

import ActionsTableContainer from './ActionsTableContainer';

ReactDOM.render(
  <ActionsTableContainer />,
  document.getElementById('appJSX'),
);
