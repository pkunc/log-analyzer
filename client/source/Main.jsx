import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import ByPersonTableContainer from './ByPersonTableContainer';
import ByPersonDateTableContainer from './ByPersonDateTableContainer';
import ByActivityTableContainer from './ByActivityTableContainer';
import ChartTabContainer from './ChartTabContainer';

const Main = () => (
	<main>
		<Switch>
			<Route exact path="/" component={Home} />
			<Route path="/person" component={ByPersonTableContainer} />
			<Route path="/person-date" component={ByPersonDateTableContainer} />
			<Route path="/activity" component={ByActivityTableContainer} />
			<Route path="/chart" component={ChartTabContainer} />
		</Switch>
	</main>
);

export default Main;
