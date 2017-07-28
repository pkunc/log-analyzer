import React from 'react';
import PropTypes from 'prop-types';

class MenuTab extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    console.log(`[MenuTab handleClick] clicked on :${this.props.id}`);
    event.preventDefault();
    this.props.handleClick(this.props.id);
  }

  render() {
    return (
      <li className={(this.props.isSelected) ? 'active' : ''}>
        <a onClick={this.handleClick} href="#">{this.props.label}</a>
      </li>
    );
  }
}

MenuTab.propTypes = {
  label: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};

// ...................

export default class MenuTabs extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(id) {
    console.log(`[MenuTabs handleClick] passing on :${id}`);
    this.props.changeMenuTab(id);
  }

  render() {
    return (
      <nav>
        <ul className="nav nav-tabs">
          { this.props.tabList.map(tab => (
            <MenuTab
              key={tab.id}
              label={tab.label}
              id={tab.id}
              isSelected={(this.props.currentMenuTab === tab.id)}
              handleClick={this.handleClick}
            />
          ))}
        </ul>
      </nav>
    );
  }

}

MenuTabs.propTypes = {
  tabList: PropTypes.array.isRequired,
  currentMenuTab: PropTypes.string.isRequired,
  changeMenuTab: PropTypes.func.isRequired,
};
