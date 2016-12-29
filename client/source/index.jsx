// 'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

// Workaround for Cloudant in browser
import { Querystring } from 'request/lib/querystring';

Querystring.prototype.unescape = function (val) {
  return unescape(val);
};

import ActionsTableContainer from './ActionsTableContainer';

// const chalk = require('chalk');

/**
 * Supporting functions
 */
function onerror(err) {
  // log any uncaught errors
  // co will not throw any errors you do not handle!!!
  console.error(err.stack);
}

class Counter2 extends React.Component {
  state = { count: 0 };
  handleClick = () => {
    this.setState({ count: this.state.count + 1 });
  };
  render() {
    return (<button onClick={this.handleClick} className="btn btn-info">{this.state.count} BUT2</button>);
  }
}

//---------------------------------------

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return (<button onClick={this.handleClick} className="btn btn-info">{this.state.count}</button>);
  }
}

//---------------------------------------

ReactDOM.render(
  <ActionsTableContainer />,
  document.getElementById('appJSX'),
);

/**
 * Main App
 */

/*
function* main(person) {
  console.log(chalk.blue('Program starting'));

  // connect to the database
  const dbLogs = yield co(DB.connectDb('logs')).catch(onerror);

  // printIndexes
  yield co(DB.printAllIndexes(dbLogs)).catch(onerror);

  // printDatabases
  yield co(DB.printAllDatabases()).catch(onerror);

  activities = yield co(access.getActivity(dbLogs, person)).catch(onerror);
  console.log(activities);

  console.log(chalk.blue('Program ending'));
}
*/

// co(main('steve.lievens@silvergreen.eu')).catch(onerror);
