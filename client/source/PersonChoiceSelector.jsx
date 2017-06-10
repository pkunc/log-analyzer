import React from 'react';
import ChoiceSelector from './ChoiceSelector';

export default class PersonChoiceSelector extends React.Component {
  static propTypes = {
    options: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    selected: React.PropTypes.string.isRequired,
    updateSelected: React.PropTypes.func.isRequired,
  }

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
