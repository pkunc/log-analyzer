import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import Griddle, { plugins, RowDefinition, ColumnDefinition } from 'griddle-react';
import PersonsQuery from './queries/PersonsQuery.gql';

class ByPersonDateTableContainer extends React.Component {
	render() {
		if (this.props.data.loading) {
			return (
				<div>
					Loading...
				</div>
			);
		}

		// console.log(`[byPerson] Fetched results: "${JSON.stringify(this.props.data.persons)}"`);
		const personsData = this.props.data.persons.map(({ email, firstLogin, lastLogin }) => ({ email, firstLogin, lastLogin }));
		// console.log(`[byPerson] Parsed out users: "${JSON.stringify(personsData)}"`);

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
		const sortProperties = [
			{ id: 'lastLogin', sortAscending: false },
		];
		const DateColumn = ({ value }) => {
			const newDate = new Date(value);
			return (
				<span>{newDate.toLocaleDateString()}</span>
			);
		};
		return (
			<div className="row">
				<br />
				<div className="col-md-9">
					<Griddle
						data={personsData}
						plugins={[plugins.LocalPlugin]}
						pageProperties={{ pageSize: 20 }}
						styleConfig={styleConfig}
						sortProperties={sortProperties}
					>
						<RowDefinition>
							<ColumnDefinition id="email" title="Who" />
							<ColumnDefinition id="firstLogin" title="First Login" customComponent={DateColumn} />
							<ColumnDefinition id="lastLogin" title="Last Login" customComponent={DateColumn} />
						</RowDefinition>
					</Griddle>
				</div>
				<div className="col-md-3">
					<p className="alert alert-info">Info</p>
					<p>This page shows dates when a person logged into IBM Connections Cloud
						for the first time and for the last time.</p>
					<p>The view is sorted by <strong>Last Login</strong> column so
						you can see people that does not access the system for the long time.</p>
				</div>
			</div>
		);
	}
}

ByPersonDateTableContainer.propTypes = {
	data: PropTypes.object.isRequired,
};

export default graphql(PersonsQuery)(ByPersonDateTableContainer);
