import React from 'react';
import ChartDemoContainer from './ChartDemoContainer';
import ChartServiceSelector from './ChartServiceSelector';

class ChartTabContainer extends React.Component {
	constructor(props) {
		super(props);
		this.services = ['FILES2', 'AUTH', 'WIKIS', 'BLOGS'];
		this.state = {
			selectedServices: [],
		};
		this.updateSelected = this.updateSelected.bind(this);
	}

	updateSelected(selectedServices) {
		// this.setState(() => ({ selectedServices }));
		this.setState({ selectedServices }, () => console.log('Just performed setState, current state is:', JSON.stringify(this.state)));
		// setTimeout(() => this.setState({ selectedServices }), () => console.log('Just performed setState, current state is:', JSON.stringify(this.state)));
	}

	render() {
		return (
			<div>
				<ChartServiceSelector
					options={this.services}
					selected={this.state.selectedServices}
					returnSelected={this.updateSelected}
				/>
				<ChartDemoContainer services={this.state.selectedServices} />
			</div>
		);
	}
}

export default ChartTabContainer;
