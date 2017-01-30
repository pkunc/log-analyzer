import React from 'react';

import MenuTabs from './MenuTabs';

export default class MenuTabsContainer extends React.Component {
  static propTypes = {
    initialPage: React.PropTypes.string.isRequired,
    changePage: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      currentMenuTab: this.props.initialPage,
    };
    this.changeMenuTab = this.changeMenuTab.bind(this);
  }

  tabList = [
    { id: 'by-person', label: 'By Person' },
    { id: 'by-activity', label: 'By Activity' },
    { id: 'by-date', label: 'By Date' },
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
