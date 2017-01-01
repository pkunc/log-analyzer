// 'use strict';

import React from 'react';

class ActivityRow extends React.Component {
  static propTypes = {
    date: React.PropTypes.string.isRequired,
    email: React.PropTypes.string.isRequired,
    object: React.PropTypes.string,
  }

  render() {
    const newDate = new Date(this.props.date);
    return (
      <tr>
        <td>{newDate.toString()}</td>
        <td>{this.props.email}</td>
        <td>{this.props.object}</td>
      </tr>
    );
  }
}

export default class ActivityTable extends React.Component {
  static propTypes = {
    initialActivities: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      activities: this.props.initialActivities,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      activities: nextProps.initialActivities,
    });
  }

  render() {
    const rows = [];
    /* eslint no-underscore-dangle: ["warn", { "allow": ["_id"] }] */
    this.state.activities.forEach((activity) => {
      rows.push(<ActivityRow {...activity} key={activity._id} />);
    });

    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th >Date</th>
            <th >Email</th>
            <th >Object</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}
