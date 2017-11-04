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
			<CheckboxSelector
				title="Select services to display"
				options={this.state.optionPairs}
				selected={this.props.selected}
				returnSelected={this.props.returnSelected}
			/>
		);
	}
}

ChartServiceSelector.propTypes = {
	options: PropTypes.arrayOf(PropTypes.string).isRequired,
	selected: PropTypes.array.isRequired,
	returnSelected: PropTypes.func.isRequired,
};
