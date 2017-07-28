import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import PersonListSelector from './PersonListSelector';
import PersonChoiceSelector from './PersonChoiceSelector';

const Griddle = require('griddle-react');
const access = require('../../lib/dbAccess.js');
const co = require('co');

class DateColumn extends React.Component {
  render() {
    const newDate = new Date(this.props.data);
    return (
      <div>{newDate.toString()}</div>
    );
  }
}

DateColumn.propTypes = {
  data: PropTypes.string.isRequired,
};

// ---------------------------------

export default class ByPersonTableContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPersonChoice: '',
      selectedPerson: '',
      data: [],
      options: [],
      optionsTypeahead: [],
    };
    this.updateSelected = this.updateSelected.bind(this);
    this.updateSelectedChoice = this.updateSelectedChoice.bind(this);
    this.updateSelectedTypeahead = this.updateSelectedTypeahead.bind(this);
    this.fetchOptions = this.fetchOptions.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    co(this.fetchOptions()).catch(onerror);
  }

  * fetchOptions() {
    // fetch names of all users mentioned in database
    console.log(`[byPerson.fetchOptions] Will fetch users from database "${this.props.db.config.db}"`);
    const result = yield co(access.getUserActions(this.props.db)).catch(onerror);
    // console.log(`[byPerson.fetchOptions] Fetched results: "${JSON.stringify(result)}"`);
    const options = result.map(({ key, value }) => key);
    // console.log(`[byPerson.fetchOptions] Fetched users: "${JSON.stringify(options)}"`);
    const optionsTypeahead = options.map(key => ({ value: key, label: key }));
    // console.log(`[byPerson.fetchOptions] Typeahead options: "${JSON.stringify(optionsTypeahead)}"`);
    this.setState({ options, optionsTypeahead });
  }

  * fetchData(selectedPerson) {
    console.log(`[byPerson.fetchData] Will fetch data from database "${this.props.db.config.db}" for user "${selectedPerson}"`);
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

  updateSelectedTypeahead(val) {
    console.log(`[byPerson.updateSelectedTypeahead] Setting selected typeahead value to: ${JSON.stringify(val)}`);
    this.updateSelected(val.value);
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
      <div className="row">
        <br />
        <div className="col-md-9">
          <p className="text-info">Showing activities for user: <em>{this.state.selectedPerson}</em></p>
          <PersonChoiceSelector
            options={['typeahead', 'list']}
            selected={this.state.selectedPersonChoice}
            updateSelected={this.updateSelectedChoice}
          />
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
              <Select
                name="select-person-typeahead"
                value={this.state.selectedPerson}
                options={this.state.optionsTypeahead}
                onChange={this.updateSelectedTypeahead}
                clearable={false}
              />
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
        <div className="col-md-3">
          <p className="bg-info text-info" style={{ padding: '8px' }}>Info</p>
          <p>This page shows list of all activities performed by
            a selected person. You have two option how to select a person:</p>
          <ol type="a">
            <li>choose <strong>typeahed</strong> and start typing part of
                person&apos;s e-mail address</li>
            <li>chose <strong>list</strong> and select person from the populated
                list of of users; domain part of e-mail address is not displayed</li>
          </ol>
          <p>Use <strong>Filter Results</strong> filed to narrow down
            the list of activities. Type the name of activity
            (blog, wiki, login) or the name of content (community name,
            file name, blog post name).</p>
        </div>
      </div>
    );
  }
}

ByPersonTableContainer.propTypes = {
  db: PropTypes.object.isRequired,
};
