import React from 'react';
import PropTypes from 'prop-types';

const Griddle = require('griddle-react');
const access = require('../../lib/dbAccess.js');
const co = require('co');

export default class ByActivityTableContainer extends React.Component {
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
    console.log(`[byActivity.fetchData] Will fetch data from database "${this.props.db.config.db}"`);
    const data = yield co(access.getActions(this.props.db)).catch(onerror);
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
      <div className="row">
        <br />
        <div className="col-md-9">
          <Griddle
            results={this.state.data}
            resultsPerPage={20}
            showFilter
            columnMetadata={columnMetadata}
            useGriddleStyles={false}
            tableClassName="table table-bordered table-striped table-hoverd"
          />
        </div>
        <div className="col-md-3">
          <p className="bg-info text-info" style={{ padding: '8px' }}>Info</p>
          <p>This page shows list of all types of activities that are logged
            by Connections Cloud system.</p>
          <p>You can use it as a reference when you need to find event names
            for specific tasks, like <em>all Wiki related activities </em>
            or <em>all activities that create a content</em>.</p>
        </div>
      </div>
    );
  }
}

ByActivityTableContainer.propTypes = {
  db: PropTypes.object.isRequired,
};
