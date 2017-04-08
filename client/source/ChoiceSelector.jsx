import React from 'react';

export default class ChoiceSelector extends React.Component {
  static propTypes = {
    options: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    selected: React.PropTypes.string.isRequired,
    updateSelected: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.renderOption = this.renderOption.bind(this);
  }

  handleChange(event) {
    const newSelected = event.target.value;
    console.log(`[ChoiceSelector.handleChange] Selected: ${newSelected}`);
    this.props.updateSelected(newSelected);
  }

  renderOption(option) {
    const isChecked = (this.props.selected === option.value);
    return (
      <label htmlFor={option.value} key={option.value} className="radio-inline">
        <input
          type="radio"
          checked={isChecked}
          value={option.value}
          id={option.value}
          onChange={this.handleChange}
        />
        {option.label}
      </label>
    );
  }

  render() {
    return (
      <div>
        <form className="form-inline">
          <div className="form-group">
            {this.props.options.map(option => this.renderOption(option))}
          </div>
        </form>
      </div>
    );
  }
}
