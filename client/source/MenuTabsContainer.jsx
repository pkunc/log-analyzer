import React from 'react';
import PropTypes from 'prop-types';

import MenuTabs from './MenuTabs';

export default class MenuTabsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMenuTab: this.props.initialPage,
    };
    this.changeMenuTab = this.changeMenuTab.bind(this);
  }

  tabList = [
    { id: 'by-person', label: 'By Person' },
    { id: 'by-person-date', label: 'By Person-Date' },
    { id: 'by-activity', label: 'By Activity' },
  ];

  changeMenuTab(id) {
    console.log(`[TabsContainer changeMenuTab] passing on :${id}`);
    this.setState({ currentMenuTab: id });
    this.props.changePage(id);
  }

  render() {
    return (
      <MenuTabs
        tabList={this.tabList}
        currentMenuTab={this.state.currentMenuTab}
        changeMenuTab={this.changeMenuTab}
      />
    );
  }
}

MenuTabsContainer.propTypes = {
  initialPage: PropTypes.string.isRequired,
  changePage: PropTypes.func.isRequired,
};
