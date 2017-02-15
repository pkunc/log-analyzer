import React from 'react';
import PersonListSelector from './PersonListSelector';
import PersonChoiceSelector from './PersonChoiceSelector';

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
      selectedPersonChoice: '',
      selectedPerson: '',
      data: [],
      options: [],
    };
    this.updateSelected = this.updateSelected.bind(this);
    this.updateSelectedChoice = this.updateSelectedChoice.bind(this);
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

  * fetchData(selectedPerson) {
    console.log(`[byPerson.fetchData] Will fetch data from database "${this.props.db.config.db}" for string "${selectedPerson}"`);
    const data = yield co(access.getActivity(this.props.db, selectedPerson)).catch(onerror);
    // console.log(`[byPerson.fetchData] Fetched data: ${JSON.stringify(data)}`);
    this.setState({ data });
    // console.log(`[byPerson.fetchData] this.state.data is now: ${JSON.stringify(this.state.data)}`);
  }

  updateSelected(selectedPerson) {
    console.log(`[byPerson.updateSelected] Setting selected person to: ${selectedPerson}`);
    this.setState({ selectedPerson });
    co(this.fetchData(selectedPerson)).catch(onerror);
  }

  updateSelectedChoice(selectedPersonChoice) {
    console.log(`[byPerson.updateSelectedChoice] Setting choice to: ${selectedPersonChoice}`);
    this.setState({ selectedPersonChoice });
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
        <p>Choice is: <em>{this.state.selectedPersonChoice}</em></p>
        <p>Showing activities for user: <em>{this.state.selectedPerson}</em></p>
        <PersonChoiceSelector options={['typeahead', 'list']} selected={this.state.selectedPersonChoice} updateSelected={this.updateSelectedChoice} />
        { (this.state.selectedPersonChoice === 'list') ?
          <div>
            <PersonListSelector
              options={this.state.options}
              selected={this.state.selectedPerson}
              updateSelected={this.updateSelected}
            />
          </div>
           : null
        }
        { (this.state.selectedPersonChoice === 'typeahead') ?
          <div>
            Form
          </div>
           : null
        }
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
