import React from 'react';

const Griddle = require('griddle-react');
const access = require('../../lib/dbAccess.js');
const co = require('co');

class DateColumn extends React.Component {
  static propTypes = {
    data: React.PropTypes.number.isRequired,
  }
  render() {
    const dateString = this.props.data.toString();
    const dateY = dateString.substring(0, 4);
    const dateM = dateString.substring(4, 6);
    const dateD = dateString.substring(6, 8);
    const date = new Date(dateY, dateM-1, dateD);
    const newDate = new Date(date);
    return (
      <div>{newDate.toLocaleDateString()}</div>
    );
  }
}

// ---------------------------------

export default class ByPersonDateTableContainer extends React.Component {
  static propTypes = {
    db: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      db: undefined,
      data: [],
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    co(this.fetchData()).catch(onerror);
  }

  * fetchData() {
    console.log(`[byPersonDate.fetchData] Will fetch data from database "${this.props.db.config.db}"`);
    const result = yield co(access.getUserDate(this.props.db)).catch(onerror);
    // console.log(`[byPersonDate.fetchData] Fetched data: ${JSON.stringify(result)}`);
    const data = result.map(({ key, value }) =>
      ({ email: key, firstLogin: value.min, lastLogin: value.max }),
    );
    // console.log(`[byPersonDate.fetchData] Modified data: ${JSON.stringify(data)}`);
    this.setState({ data });
    // console.log(`[byPersonDate.fetchData] this.state.data is now: ${JSON.stringify(this.state.data)}`);
  }

  render() {
    const columnMetadata = [
      {
        columnName: 'email',
        displayName: 'Who',
      },
      {
        columnName: 'firstLogin',
        displayName: 'First Login',
        customComponent: DateColumn,
      },
      {
        columnName: 'lastLogin',
        displayName: 'Last Login',
        customComponent: DateColumn,
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
