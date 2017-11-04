import React from 'react';
import PropTypes from 'prop-types';
import ChoiceSelector from './ChoiceSelector';

export default class PersonListSelector extends React.Component {
	static formatOption(option) {
		const atPosition = option.indexOf('@');
		if (atPosition === -1) {
			return option;
		} else if (atPosition === 0) {
			return option;
		}
		const name = option.slice(0, atPosition);
		return name;
	}

	constructor(props) {
		super(props);
		this.state = {
			optionPairs: [],
		};
		this.state.optionPairs = this.props.options.map(key => ({ value: key, label: PersonListSelector.formatOption(key) }));
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

PersonListSelector.propTypes = {
	options: PropTypes.arrayOf(PropTypes.string).isRequired,
	selected: PropTypes.string.isRequired,
	updateSelected: PropTypes.func.isRequired,
};
