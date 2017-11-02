import React from 'react';
import _ from 'lodash';
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

	updateSelected(selectedService) {
		let selectedServices;
		const currentSelectedServices = this.state.selectedServices;
		if (currentSelectedServices.includes(selectedService)) {
			console.log(`[ChartTabContainer.updateSelected] Removing service from selected: ${selectedService}`);
			selectedServices = _.pull(currentSelectedServices, selectedService);
		} else {
			console.log(`[ChartTabContainer.updateSelected] Adding service to selected: ${selectedService}`);
			selectedServices = _.union(currentSelectedServices, [selectedService]);
		}
		console.log(`[ChartTabContainer.updateSelected] Current selectedServices: ${selectedServices}`);

		// this.setState(() => ({ selectedServices }));
		this.setState({ selectedServices }, () => console.log('Udelal jsem setState, aktualni this.state je:', JSON.stringify(this.state)));
		// setTimeout(() => this.setState({ selectedServices }), () => console.log('Udelal jsem setState, aktualni this.state je:', JSON.stringify(this.state)));

		// this.forceUpdate(() => console.log('Udelal jsem ForceUpdate, aktualni this.state je:', JSON.stringify(this.state)));
	}

	render() {
		return (
			<div>
				<p>[ChartTabContainer]SelectedServices: {this.state.selectedServices}</p>
				<ChartServiceSelector
					options={this.services}
					selected={this.state.selectedServices}
					updateSelected={this.updateSelected}
				/>
				<ChartDemoContainer services={this.state.selectedServices} />
			</div>
		);
	}
}

export default ChartTabContainer;
