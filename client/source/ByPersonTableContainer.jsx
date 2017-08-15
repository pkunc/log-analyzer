import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import Select from 'react-select';
import PersonListSelector from './PersonListSelector';
import PersonChoiceSelector from './PersonChoiceSelector';
import ByPersonTable from './ByPersonTable';
import PersonsQuery from './queries/PersonsQuery.gql';

class ByPersonTableContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPersonChoice: '',
      selectedPerson: '',
    };
    this.updateSelected = this.updateSelected.bind(this);
    this.updateSelectedChoice = this.updateSelectedChoice.bind(this);
    this.updateSelectedTypeahead = this.updateSelectedTypeahead.bind(this);
  }

  updateSelected(selectedPerson) {
    console.log(`[byPerson.updateSelected] Setting selected person to: ${selectedPerson}`);
    this.setState({ selectedPerson });
    // co(this.fetchData(selectedPerson)).catch(onerror);
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
    if (this.props.data.loading) {
      return (
        <div>
          Loading...
        </div>
      );
    }

    // console.log(`[byPerson] Fetched results: "${JSON.stringify(this.props.data.persons)}"`);
    const options = this.props.data.persons.map(({ email }) => email);
    // console.log(`[byPerson] Parsed out users: "${JSON.stringify(options)}"`);
    const optionsTypeahead = this.props.data.persons.map(({ email }) => ({ value: email, label: email }));
    // console.log(`[byPerson] Typeahead options: "${JSON.stringify(optionsTypeahead)}"`);

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
                options={options}
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
                options={optionsTypeahead}
                onChange={this.updateSelectedTypeahead}
                clearable={false}
              />
            </div>
            : null
          }
          <br />
          <ByPersonTable email={this.state.selectedPerson} />
        </div>
        <div className="col-md-3">
          <p className="alert alert-info">Info</p>
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
  data: PropTypes.object.isRequired,
};

export default graphql(PersonsQuery)(ByPersonTableContainer);
