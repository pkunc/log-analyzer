import React from 'react';
import ChartDemoContainer from './ChartDemoContainer';

class ChartTabContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			services: ['FILES2', 'AUTH', 'WIKIS', 'BLOGS'],
		};
	}

	render() {
		return (
			<ChartDemoContainer services={this.state.services} />
		);
	}
}

export default ChartTabContainer;
