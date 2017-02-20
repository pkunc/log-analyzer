import React from 'react';
import MenuTabsContainer from './MenuTabsContainer';
import ByPersonTableContainer from './ByPersonTableContainer';
import ByActivityTableContainer from './ByActivityTableContainer';
import ByPersonDateTableContainer from './ByPersonDateTableContainer';

const DB = require('../../lib/dbTools.js');
const co = require('co');

export default class LogAnalyzer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      db: undefined,
      // currentPage: 'by-person',
      currentPage: '',
    };
    this.changePage = this.changePage.bind(this);
  }

  componentDidMount() {
    co(this.initDatabase('logs')).catch(onerror);
  }

  * initDatabase(dbname) {
    console.log('[LogAnalyzer.initDb] Init DB starting');

    // connect to the database
    const db = yield* DB.connectDb(dbname);

    this.setState({ db });
    console.log(`[LogAnalyzer.initDb] Mounted db: ${JSON.stringify(db.config.db)}`);
    console.log('[LogAnalyzer.initDb] Init DB ending');
  }

  changePage(id) {
    console.log(`[LogAnalyzer.changePage] changing page to :${id}`);
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
          <ByPersonTableContainer db={this.state.db} /> : null }
        { (this.state.currentPage === 'by-activity') ?
          <ByActivityTableContainer db={this.state.db} /> : null }
        { (this.state.currentPage === 'by-person-date') ?
          <ByPersonDateTableContainer db={this.state.db} /> : null }
      </div>
    );
  }
}
