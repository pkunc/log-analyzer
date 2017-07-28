import React from 'react';
import PropTypes from 'prop-types';
import ChoiceSelector from './ChoiceSelector';

export default class PersonChoiceSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      optionPairs: [],
    };
    this.state.optionPairs = this.props.options.map(key => ({ value: key, label: key }));
  }

  render() {
    return (
      <ChoiceSelector
        options={this.state.optionPairs}
        selected={this.props.selected}
        updateSelected={this.props.updateSelected}
      />
    );
  }
}

PersonChoiceSelector.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selected: PropTypes.string.isRequired,
  updateSelected: PropTypes.func.isRequired,
};
