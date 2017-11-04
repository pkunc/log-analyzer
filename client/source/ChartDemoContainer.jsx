import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { Line } from 'react-chartjs-2';
import { Loading } from 'carbon-components-react';
import MontlyLogStatsQuery from './queries/MontlyLogStatsQuery.gql';

const colors = new Map([
	['FILES2', 'red'],
	['WIKIS', 'blue'],
	['AUTH', 'green'],
	['BLOGS', 'yellow'],
]);

class ChartDemoContainer extends React.Component {
	componentDidMount() {
		this.props.data.refetch();
	}

	render() {
		if (this.props.data.loading) {
			return (<Loading />);
		}

		if (this.props.services.length === 0) {
			return (
				<div>
					Please select at least one service to display.
				</div>
			);
		}

		const datasets = this.props.data.montlyLogStats.map(
			({ service, stats }) => {
				const dataset = {};
				dataset.label = service;
				const statsExtracted = stats.map(
					({ count }) => count);
				dataset.data = statsExtracted;
				dataset.borderColor = colors.get(service);
				return dataset;
			});
		// console.log(`[ChartDemoContainer] Parsed out datasets: "${JSON.stringify(datasets, null, 4)}"`);

		const labels = this.props.data.montlyLogStats[0].stats.map(({ yearmonth }) => yearmonth);
		// console.log(`[ChartDemoContainer] Parsed out labels: "${JSON.stringify(labels, null, 4)}"`);

		return (
			<div>
				<Line
					data={{ labels, datasets }}
					width={100}
					height={300}
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
