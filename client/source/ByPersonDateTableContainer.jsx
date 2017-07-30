import React from 'react';
import PropTypes from 'prop-types';
import Griddle, { plugins, RowDefinition, ColumnDefinition } from 'griddle-react';

const access = require('../../lib/dbAccess.js');
const co = require('co');

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
    const styleConfig = {
      icons: {
        TableHeadingCell: {
          sortDescendingIcon: '▼',
          sortAscendingIcon: '▲',
        },
      },
      classNames: {
        Row: 'row-class',
        Table: 'table table-bordered table-striped table-hover',
      },
      styles: {
      },
    };
    const sortProperties = [
      { id: 'lastLogin', sortAscending: false },
    ];
    const DateColumn = ({ value }) => {
      const dateString = value.toString();
      const dateY = dateString.substring(0, 4);
      const dateM = dateString.substring(4, 6);
      const dateD = dateString.substring(6, 8);
      const date = new Date(dateY, dateM-1, dateD);
      const newDate = new Date(date);
      return (
        <span>{newDate.toLocaleDateString()}</span>
      );
    };
    return (
      <div className="row">
        <br />
        <div className="col-md-9">
          <Griddle
            data={this.state.data}
            plugins={[plugins.LocalPlugin]}
            pageProperties={{ pageSize: 20 }}
            styleConfig={styleConfig}
            sortProperties={sortProperties}
          >
            <RowDefinition>
              <ColumnDefinition id="email" title="Who" />
              <ColumnDefinition id="firstLogin" title="First Login" customComponent={DateColumn} />
              <ColumnDefinition id="lastLogin" title="Last Login" customComponent={DateColumn} />
            </RowDefinition>
          </Griddle>
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
