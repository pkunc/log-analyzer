import React from 'react';
import ChartDemo from './ChartDemo';

class ChartDemoContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
			data: [65, 59, 80, 81, 56, 55, 40],
		};
	}

	render() {
		return (
			<ChartDemo labels={this.state.labels} data={this.state.data} />
		);
	}
}

export default ChartDemoContainer;
