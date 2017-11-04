import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'carbon-components-react';

export default class CheckboxSelector extends React.Component {
	constructor(props) {
		super(props);
		this.selectedServices = new Set();
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(checked, id, event) {
		// event.preventDefault();
		console.log(`[CheckboxSelector.handleChange] Selected: ${id}`);
		if (checked) {
			this.selectedServices.add(id);
		} else {
			this.selectedServices.delete(id);
		}
		const selectedServicesArray = Array.from(this.selectedServices);
		this.props.returnSelected(selectedServicesArray);
	}

	renderCheckbox(option) {
		// const isChecked = (this.props.selected.includes(option.value));
		return (
			<Checkbox
				defaultChecked={false}
				onChange={this.handleChange}
				id={option.value}
				labelText={option.label}
				iconDescription={option.label}
				key={option.value}
			/>
		);
	}

	render() {
		return (
			<fieldset className="bx--fieldset">
				<legend className="bx--label">
					{this.props.title}
				</legend>
				{this.props.options.map(option => this.renderCheckbox(option))}
			</fieldset>
		);
	}
}

CheckboxSelector.propTypes = {
	title: PropTypes.string.isRequired,
	options: PropTypes.arrayOf(PropTypes.object).isRequired,
	selected: PropTypes.array.isRequired,
	returnSelected: PropTypes.func.isRequired,
};
