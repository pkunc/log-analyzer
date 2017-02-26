import React from 'react';

export default class PersonChoiceSelector extends React.Component {
  static propTypes = {
    options: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
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
    console.log(`[PersonChoiceSelector.handleChange] Selected: ${newSelected}`);
    this.props.updateSelected(newSelected);
  }

  renderOption(option) {
    const isChecked = (this.props.selected === option);
    return (
      <label htmlFor={option} key={option} className="radio-inline">
        <input
          type="radio"
          checked={isChecked}
          value={option}
          id={option}
          onChange={this.handleChange}
        />
        {option}
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
