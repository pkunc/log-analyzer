import React from 'react';
import PropTypes from 'prop-types';

export default class CheckboxSelector extends React.Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.renderOption = this.renderOption.bind(this);
	}

	handleChange(event) {
		// event.preventDefault();
		const newSelected = event.target.value;
		console.log(`[CheckboxSelector.handleChange] Selected: ${newSelected}`);
		this.props.updateSelected(newSelected);
	}

	renderOption(option) {
		const isChecked = (this.props.selected.includes(option.value));
		return (
			<label htmlFor={option.value} key={option.value} className="form-check-label">
				<input
					type="checkbox"
					checked={isChecked}
					value={option.value}
					id={option.value}
					onChange={this.handleChange}
					className="form-check-input"
				/>
				&nbsp;{option.label}
			</label>
		);
	}

	render() {
		return (
			<div className="form-check form-check-inline">
				{this.props.options.map(option => this.renderOption(option))}
			</div>
		);
	}
}

CheckboxSelector.propTypes = {
	options: PropTypes.arrayOf(PropTypes.object).isRequired,
	selected: PropTypes.array.isRequired,
	updateSelected: PropTypes.func.isRequired,
};
