import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => (
	<header>
		<h1 className="bg-primary text-white" style={{ padding: '16px' }}>Log Analyzer</h1>
		<nav>
			<ul className="nav nav-tabs">
				<li className="nav-item"><NavLink to="/" exact activeClassName="active" className="nav-link">Home</NavLink></li>
				<li className="nav-item"><NavLink to="/person" activeClassName="active" className="nav-link">By Person</NavLink></li>
				<li className="nav-item"><NavLink to="/person-date" activeClassName="active" className="nav-link">By Person-Date</NavLink></li>
				<li className="nav-item"><NavLink to="/activity" activeClassName="active" className="nav-link">By Activity</NavLink></li>
			</ul>
		</nav>
	</header>
);

export default Header;
