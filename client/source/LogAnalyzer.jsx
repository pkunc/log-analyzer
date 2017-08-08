import React from 'react';
import MenuTabsContainer from './MenuTabsContainer';
import ByPersonTableContainer from './ByPersonTableContainer';
import ByActivityTableContainer from './ByActivityTableContainer';
import ByPersonDateTableContainer from './ByPersonDateTableContainer';
import ApolloTest from './ApolloTest';

export default class LogAnalyzer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // currentPage: 'by-person',
      currentPage: '',
    };
    this.changePage = this.changePage.bind(this);
  }

  changePage(id) {
    console.log(`[LogAnalyzer.changePage] changing page to :${id}`);
    this.setState({ currentPage: id });
  }

  render() {
    return (
      <div>
        <h1 className="bg-primary" style={{ padding: '16px' }}>Log Analyzer</h1>
        { /* }<p>Current page is:{this.state.currentPage}</p>{ */ }
        <MenuTabsContainer
          changePage={this.changePage}
          initialPage={this.state.currentPage}
        />
        { (this.state.currentPage === 'by-person') ?
          <ByPersonTableContainer /> : null }
        { (this.state.currentPage === 'by-person-date') ?
          <ByPersonDateTableContainer /> : null }
        { (this.state.currentPage === 'by-activity') ?
          <ByActivityTableContainer /> : null }
        {/* <ApolloTest email={'steve.lievens@silvergreen.eu'} /> */}
      </div>
    );
  }
}
