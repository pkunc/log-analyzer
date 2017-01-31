import React from 'react';

const Griddle = require('griddle-react');
const DB = require('../../lib/dbTools.js');
const access = require('../../lib/dbAccess.js');
const co = require('co');

export default class ByActivityTableContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      db: undefined,
      data: [],
    };
    this.initDatabase = this.initDatabase.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    co(this.initDatabase('logs')).catch(onerror);
  }

  * initDatabase(dbname) {
    console.log('[byActivity.initDb] Init DB starting');

    // connect to the database
    const db = yield co(DB.connectDb(dbname)).catch(onerror);

    yield co(DB.printAllIndexes(db)).catch(onerror);

    this.setState({ db });
    console.log(`[byActivity.initDb] Mounted db: ${JSON.stringify(db.config.db)}`);
    console.log('[byActivity.initDb] Init DB ending');

    // fetch activities data
    yield* this.fetchData();
  }

  * fetchData() {
    console.log(`[byActivity.fetchData] Will fetch data from database "${this.state.db.config.db}"`);
    const data = yield co(access.getActions(this.state.db)).catch(onerror);
    // console.log(`[byActivity.fetchData] Fetched data: ${JSON.stringify(data)}`);
    this.setState({ data });
    // console.log(`[byActivity.fetchData] this.state.data is now: ${JSON.stringify(this.state.data)}`);
  }

  render() {
    const columnMetadata = [
      {
        columnName: 'key',
        displayName: 'Activity Type',
      },
      {
        columnName: 'value',
        displayName: 'Number of occurencies',
      },
    ];
    return (
      <div>
        <Griddle
          results={this.state.data}
          resultsPerPage={20}
          showFilter
          columnMetadata={columnMetadata}
          useGriddleStyles={false}
          tableClassName="table table-bordered table-striped table-hoverd"
        />
      </div>
    );
  }
}
