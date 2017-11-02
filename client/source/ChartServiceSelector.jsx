import React from 'react';
import PropTypes from 'prop-types';
import CheckboxSelector from './CheckboxSelector';

export default class ChartServiceSelector extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			optionPairs: [],
		};
		this.state.optionPairs = this.props.options.map(key => ({ value: key, label: key }));
	}

	render() {
		return (
			<fieldset>
				<legend>Services</legend>
				<CheckboxSelector
					options={this.state.optionPairs}
					selected={this.props.selected}
					updateSelected={this.props.updateSelected}
				/>
			</fieldset>
		);
	}
}

ChartServiceSelector.propTypes = {
	options: PropTypes.arrayOf(PropTypes.string).isRequired,
	selected: PropTypes.array.isRequired,
	updateSelected: PropTypes.func.isRequired,
};
