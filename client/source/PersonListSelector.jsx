import React from 'react';
import ChoiceSelector from './ChoiceSelector';

export default class PersonListSelector extends React.Component {
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
    this.state.optionPairs = this.props.options.map(key => ({ value: key, label: this.formatOption(key) }));
  }

  handleChange(event) {
    const newSelected = event.target.value;
    console.log(`[PersonListSelector.handleChange] Selected: ${newSelected}`);
    this.props.updateSelected(newSelected);
  }

  formatOption(option) {
    const atPosition = option.indexOf('@');
    if (atPosition === -1) {
      return option;
    } else if (atPosition === 0) {
      return option;
    }
    const name = option.slice(0, atPosition);
    return name;
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
