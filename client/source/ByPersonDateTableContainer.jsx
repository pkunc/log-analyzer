import React from 'react';
import PropTypes from 'prop-types';

const Griddle = require('griddle-react');
const access = require('../../lib/dbAccess.js');
const co = require('co');

class DateColumn extends React.Component {
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

DateColumn.propTypes = {
  data: PropTypes.number.isRequired,
};

// ---------------------------------

export default class ByPersonDateTableContainer extends React.Component {
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
      <div className="row">
        <br />
        <div className="col-md-9">
          <Griddle
            results={this.state.data}
            resultsPerPage={20}
            showFilter
            columnMetadata={columnMetadata}
            initialSort="lastLogin"
            useGriddleStyles={false}
            tableClassName="table table-bordered table-striped table-hoverd"
          />
        </div>
        <div className="col-md-3">
          <p className="bg-info text-info" style={{ padding: '8px' }}>Info</p>
          <p>This page shows dates when a person logged into IBM Connections Cloud
            for the first time and for the last time.</p>
          <p>The view is sorted by <strong>Last Login</strong> column so
            you can see people that does not access the system for the long time.</p>
        </div>
      </div>
    );
  }
}

ByPersonDateTableContainer.propTypes = {
  db: PropTypes.object.isRequired,
};
