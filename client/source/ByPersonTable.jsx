import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import Griddle, { plugins, RowDefinition, ColumnDefinition } from 'griddle-react';
import LogEntriesQuery from './queries/LogEntriesQuery.gql';

class ByPersonTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
		};
	}

	render() {
		const styleConfig = {
			icons: {
				TableHeadingCell: {
					sortDescendingIcon: '▼',
					sortAscendingIcon: '▲',
				},
			},
			classNames: {
				Row: 'row-class',
				Table: 'table table-bordered table-striped table-hover',
			},
			styles: {
			},
		};
		const DateColumn = ({ value }) => {
			const newDate = new Date(value);
			return (
				<span>{newDate.toString()}</span>
			);
		};
		if (this.props.data.loading) {
			return (
				<div>
					Loading...
				</div>
			);
		}
		if (this.props.data.logEntries.length === 0) {
			return (
				<div>
					<em>Select a person. First, choose typeahead or list, then select a person.</em>
				</div>
			);
		}

		return (
			<Griddle
				data={this.props.data.logEntries}
				plugins={[plugins.LocalPlugin]}
				pageProperties={{ pageSize: 20 }}
				styleConfig={styleConfig}
				tableClassName="table table-bordered table-striped table-hoverd"
			>
				<RowDefinition>
					<ColumnDefinition id="date" title="Date" customComponent={DateColumn} />
					<ColumnDefinition id="email" title="Who" />
					<ColumnDefinition id="event" title="Action" />
					<ColumnDefinition id="object" title="Object" />
				</RowDefinition>
			</Griddle>
		);
	}
}

ByPersonTable.propTypes = {
	email: PropTypes.string,
	data: PropTypes.object.isRequired,
};

ByPersonTable.defaultProps = {
	email: '',
};

export default graphql(LogEntriesQuery, {
	options: props => ({ variables: { email: props.email } }),
})(ByPersonTable);
