import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import ChartDemo from './ChartDemo';
import MontlyLogStatsQuery from './queries/MontlyLogStatsQuery.gql';

class ChartDemoContainer extends React.Component {
	render() {
		if (this.props.data.loading) {
			return (
				<div>
					Loading...
				</div>
			);
		}

		const dataToDisplay = this.props.data.montlyLogStats.map(
			({ service, stats }) => {
				const dataset = {};
				dataset.label = service;
				const statsExtracted = stats.map(
					({ count }) => count);
				dataset.data = statsExtracted;
				return dataset;
			});
		// console.log(`[ChartDemoContainer] Parsed out dataTemp: "${JSON.stringify(dataToDisplay, null, 4)}"`);

		const labels = this.props.data.montlyLogStats[0].stats.map(({ yearmonth }) => yearmonth);
		// console.log(`[ChartDemoContainer] Parsed out labelsTemp: "${JSON.stringify(labels, null, 4)}"`);

		return (
			<ChartDemo labels={labels} datasets={dataToDisplay} />
		);
	}
}

ChartDemoContainer.propTypes = {
	services: PropTypes.array.isRequired,
	data: PropTypes.object.isRequired,
};

export default graphql(MontlyLogStatsQuery, {
	options: props => ({ variables: { services: props.services } }),
})(ChartDemoContainer);
