import React from 'react';
import MenuTabsContainer from './MenuTabsContainer';
import ByPersonTableContainer from './ByPersonTableContainer';
import ByActivityTableContainer from './ByActivityTableContainer';

export default class LogAnalyzer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 'by-date',
    };
    this.changePage = this.changePage.bind(this);
  }

  changePage(id) {
    console.log(`[LogAnalyzer changePage] changing page to :${id}`);
    this.setState({ currentPage: id });
  }

  render() {
    return (
      <div>
        <p>Current page is:{this.state.currentPage}</p>
        <MenuTabsContainer
          changePage={this.changePage}
          initialPage={this.state.currentPage}
        />
        { (this.state.currentPage === 'by-person') ?
          <ByPersonTableContainer /> : null }
        { (this.state.currentPage === 'by-activity') ?
          <ByActivityTableContainer /> : null }
      </div>
    );
  }
}
