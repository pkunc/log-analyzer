import React from 'react';
import Switch from './Switch';

const Griddle = require('griddle-react');
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
  static propTypes = {
    db: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      selected: '',
      data: [],
      options: [],
    };
    this.updateSelected = this.updateSelected.bind(this);
    this.fetchOptions = this.fetchOptions.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    co(this.fetchOptions()).catch(onerror);
  }

  * fetchOptions() {
    console.log('[byPerson.fetchOptions] Init DB starting');
    // fetch names of all users mentioned in database
    // console.log(`[byPerson.fetchOptions] Will fetch users from database "${this.props.db.config.db}"`);
    const result = yield co(access.getUserActions(this.props.db)).catch(onerror);
    // console.log(`[byPerson.fetchOptions] Fetched results: "${JSON.stringify(result)}"`);
    const options = result.map(({ key, value }) => key);
    // console.log(`[byPerson.fetchOptions] Fetched users: "${JSON.stringify(options)}"`);
    this.setState({ options });
    console.log('[byPerson.fetchOptions] Init DB ending');
  }

  * fetchData(selected) {
    console.log(`[byPerson.fetchData] Will fetch data from database "${this.props.db.config.db}" for string "${selected}"`);
    const data = yield co(access.getActivity(this.props.db, selected)).catch(onerror);
    // console.log(`[byPerson.fetchData] Fetched data: ${JSON.stringify(data)}`);
    this.setState({ data });
    // console.log(`[byPerson.fetchData] this.state.data is now: ${JSON.stringify(this.state.data)}`);
  }

  updateSelected(selected) {
    console.log(`[byPerson.updateSelected] Setting selected to: ${selected}`);
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
