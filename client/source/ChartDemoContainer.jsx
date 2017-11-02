import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { Line } from 'react-chartjs-2';
import ChartDemo from './ChartDemo';
import MontlyLogStatsQuery from './queries/MontlyLogStatsQuery.gql';

const colors = {
	FILES2: 'red',
	WIKIS: 'blue',
	AUTH: 'green',
	BLOGS: 'yellow',
};

class ChartDemoContainer extends React.Component {
	componentDidMount() {
		this.props.data.refetch();
	}

	render() {
		if (this.props.data.loading) {
			return (
				<div>
					Loading...
				</div>
			);
		}

		if (this.props.services.length === 0) {
			return (
				<div>
					Please select at least one service to display.
				</div>
			);
		}

		this.props.data.refetch();

		const dataToDisplay = this.props.data.montlyLogStats.map(
			({ service, stats }) => {
				const dataset = {};
				dataset.label = service;
				const statsExtracted = stats.map(
					({ count }) => count);
				dataset.data = statsExtracted;
				dataset.borderColor = colors[service];
				return dataset;
			});
		// console.log(`[ChartDemoContainer] Parsed out dataToDisplay: "${JSON.stringify(dataToDisplay, null, 4)}"`);

		const labels = this.props.data.montlyLogStats[0].stats.map(({ yearmonth }) => yearmonth);
		// console.log(`[ChartDemoContainer] Parsed out labels: "${JSON.stringify(labels, null, 4)}"`);

		const tempServices = this.props.data.montlyLogStats.map(({ service }) => service);
		console.log(`[ChartDemoContainer] Parsed out tempServices: "${JSON.stringify(tempServices, null, 4)}"`);

		return (
			<div>
				<p>[ChartDemoContainer]SelectedServices: {this.props.services}</p>
				<p>[ChartDemoContainer]Fetched GraphQL this.props.data: {JSON.stringify(tempServices)}</p>
				<ChartDemo labels={labels} datasets={dataToDisplay} />
				<h1>Chart INSIDE</h1>
				<Line
					data={{ labels, datasets: dataToDisplay }}
					width={100}
					height={100}
					options={{
						maintainAspectRatio: false,
					}}
				/>
			</div>
		);
	}
}

ChartDemoContainer.propTypes = {
	services: PropTypes.array.isRequired,
	data: PropTypes.object.isRequired,
};

export default graphql(MontlyLogStatsQuery, {
	options: props => ({
		variables: { services: props.services },
		fetchPolicy: 'network-only',
	}),
})(ChartDemoContainer);
