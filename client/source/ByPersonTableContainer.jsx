import React from 'react';
import Switch from './Switch';

const Griddle = require('griddle-react');
const DB = require('../../lib/dbTools.js');
const access = require('../../lib/dbAccess.js');
const co = require('co');

class DateColumn extends React.Component {
  static propTypes = {
    data: React.PropTypes.string.isRequired,
  }
  render() {
    const newDate = new Date(this.props.data);
    return (
      <div>{newDate.toString()}</div>
    );
  }
}

export default class ByPersonTableContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: '',
      db: undefined,
      data: [],
      options: [],
    };
    this.updateSelected = this.updateSelected.bind(this);
    this.initDatabase = this.initDatabase.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    co(this.initDatabase('logs')).catch(onerror);
  }

  * initDatabase(dbname) {
    console.log('[table.initDb] Init DB starting');

    // connect to the database
    const db = yield co(DB.connectDb(dbname)).catch(onerror);

    this.setState({ db });
    console.log(`[table.initDb] Mounted db: ${JSON.stringify(db.config.db)}`);

    // fetch names of all users mentioned in database
    // console.log(`[table.fetchUsers] Will fetch users from database "${this.state.db.config.db}"`);
    const result = yield co(access.getUserActions(this.state.db)).catch(onerror);
    // console.log(`[table.fetchUsers] Fetched results: "${JSON.stringify(result)}"`);
    const options = result.map(({ key, value }) => key);
    // console.log(`[table.fetchUsers] Fetched users: "${JSON.stringify(options)}"`);
    this.setState({ options });
    console.log('[table.initDb] Init DB ending');
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
    const columnMetadata = [
      {
        columnName: 'date',
        displayName: 'Date',
        customComponent: DateColumn,
      },
      {
        columnName: 'email',
        displayName: 'Who',
      },
      {
        columnName: 'event',
        displayName: 'Action',
      },
      {
        columnName: 'object',
        displayName: 'Object',
      },
    ];
    return (
      <div>
        <p>Showing activities for user: <em>{this.state.selected}</em></p>
        <Switch options={this.state.options} selected={this.state.selected} updateSelected={this.updateSelected} />
        <br />
        <Griddle
          results={this.state.data}
          resultsPerPage={20}
          showFilter
          columns={['date', 'email', 'event', 'object']}
          columnMetadata={columnMetadata}
          useGriddleStyles={false}
          tableClassName="table table-bordered table-striped table-hoverd"
        />
      </div>
    );
  }
}
