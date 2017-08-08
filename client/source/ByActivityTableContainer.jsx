import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import Griddle, { plugins, RowDefinition, ColumnDefinition } from 'griddle-react';
import EventsQuery from './queries/EventsQuery.gql';

class ByActivityTableContainer extends React.Component {
  render() {
    if (this.props.data.loading) {
      return (
        <div>
          Loading...
        </div>
      );
    }

    console.log(`[byEvent] Fetched results: "${JSON.stringify(this.props.data.events)}"`);

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

    return (
      <div className="row">
        <br />
        <div className="col-md-9">
          <Griddle
            data={this.props.data.events}
            plugins={[plugins.LocalPlugin]}
            pageProperties={{ pageSize: 20 }}
            styleConfig={styleConfig}
          >
            <RowDefinition>
              <ColumnDefinition id="service" title="Service" />
              <ColumnDefinition id="event" title="Event" />
              <ColumnDefinition id="occurrences" title="Number of occurrences" />
            </RowDefinition>
          </Griddle>
        </div>
        <div className="col-md-3">
          <p className="bg-info text-info" style={{ padding: '8px' }}>Info</p>
          <p>This page shows list of all types of activities that are logged
            by Connections Cloud system.</p>
          <p>You can use it as a reference when you need to find event names
            for specific tasks, like <em>all Wiki related activities </em>
            or <em>all activities that create a content</em>.</p>
        </div>
      </div>
    );
  }
}

ByActivityTableContainer.propTypes = {
  data: PropTypes.object.isRequired,
};

export default graphql(EventsQuery)(ByActivityTableContainer);
