import React from 'react';
import PropTypes from 'prop-types';
import { Line, defaults } from 'react-chartjs-2';

class ChartDemo extends React.Component {
	render() {
		const chartDataTemp = {};
		chartDataTemp.labels = this.props.labels;
		// console.log(`[ChartDemo] Chart.js defaults data: "${JSON.stringify(defaults, null, 4)}"`);
		// console.log(`[ChartDemo] Props data: "${JSON.stringify(this.props.datasets, null, 4)}"`);
		// console.log(`[ChartDemo] Parsed out data: "${JSON.stringify(chartDataTemp, null, 4)}"`);

		// defaults.global.animation = false;

		const chartData = {
			labels: this.props.labels,
			datasets: this.props.datasets,
			// datasets: [
			// 	{
			// 		label: this.props.datasets[0].service,
			// 		fill: false,
			// 		lineTension: 0.1,
			// 		backgroundColor: 'rgba(75,192,192,0.4)',
			// 		borderColor: 'rgba(75,192,192,1)',
			// 		borderCapStyle: 'butt',
			// 		borderDash: [],
			// 		borderDashOffset: 0.0,
			// 		borderJoinStyle: 'miter',
			// 		pointBorderColor: 'rgba(75,192,192,1)',
			// 		pointBackgroundColor: '#fff',
			// 		pointBorderWidth: 1,
			// 		pointHoverRadius: 5,
			// 		pointHoverBackgroundColor: 'rgba(75,192,192,1)',
			// 		pointHoverBorderColor: 'rgba(220,220,220,1)',
			// 		pointHoverBorderWidth: 2,
			// 		pointRadius: 1,
			// 		pointHitRadius: 10,
			// 		data: this.props.datasets[0].counts,
			// 	},
			// ],
		};

		return (
			<div>
				<h1>Chart</h1>
				<Line
					data={chartData}
					width={100}
					height={400}
					options={{
						maintainAspectRatio: false,
					}}
				/>
			</div>
		);
	}
}

ChartDemo.propTypes = {
	labels: PropTypes.array.isRequired,
	datasets: PropTypes.array.isRequired,
};

export default ChartDemo;
