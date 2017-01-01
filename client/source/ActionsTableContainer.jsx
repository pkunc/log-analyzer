// 'use strict';

import React from 'react';
import Switch from './Switch';
import ActivityTable from './ActivityTable';

const Griddle = require('griddle-react');
const DB = require('../../lib/dbTools.js');
const access = require('../../lib/dbAccess.js');
const co = require('co');

export default class ActionsTableContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: '',
      db: undefined,
      data: [],
      // options: ['steve.lievens@silvergreen.eu', 'lisa.learned@silvergreen.eu', 'petr.kunc@silvergreen.eu'],
      options: [],
    };
    console.log(`[table.constructor] Initial state: ${JSON.stringify(this.state)}`);
    this.updateSelected = this.updateSelected.bind(this);
    this.initDatabase = this.initDatabase.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    co(this.initDatabase('logs')).catch(onerror);
    console.log('[table.didMount] Will Mount db');
  }

  * initDatabase(dbname) {
    console.log('Init DB starting');

    // connect to the database
    const db = yield co(DB.connectDb(dbname)).catch(onerror);

    // printIndexes
    yield co(DB.printAllIndexes(db)).catch(onerror);

    // printDatabases
    yield co(DB.printAllDatabases()).catch(onerror);

    this.setState({ db });
    console.log(`[table.initDb] Mounted db: ${JSON.stringify(db.config.db)}`);

    // fetch names of all users mentioned in database
    console.log(`[table.fetchUsers] Will fetch users from database "${this.state.db.config.db}"`);
    const result = yield co(access.getUserActions(this.state.db)).catch(onerror);
    console.log(`[table.fetchUsers] Fetched results: "${JSON.stringify(result)}"`);
    const options = result.map(({ key, value }) => key);
    console.log(`[table.fetchUsers] Fetched users: "${JSON.stringify(options)}"`);
    this.setState({ options });
    console.log('Init DB ending');
  }

  * fetchData(selected) {
    console.log(`[table.fetchData] Will fetch data from database "${this.state.db.config.db}" for string "${selected}"`);
    const data = yield co(access.getActivity(this.state.db, selected)).catch(onerror);
    // console.log(`[table.fetchData] Fetched data: ${JSON.stringify(data)}`);
    this.setState({ data });
    // console.log(`[table.fetchData] this.state.data is now: ${JSON.stringify(this.state.data)}`);
  }

  updateSelected(selected) {
    console.log(`[table.updateSelected] Setting selected to: ${selected}`);
    this.setState({ selected });
    co(this.fetchData(selected)).catch(onerror);
  }

  render() {
    return (
      <div>
        <p>Selected is set to: {this.state.selected}.</p>
        <Switch options={this.state.options} selected={this.state.selected} updateSelected={this.updateSelected} />
        <ActivityTable initialActivities={this.state.data} />
        <Griddle
          results={this.state.data}
          showFilter
          columns={['date', 'email', 'event', 'object']}
          useGriddleStyles={false}
          tableClassName="table table-bordered table-striped table-hoverd"
        />
      </div>
    );
  }
}
