import React from 'react';

class MenuTab extends React.Component {
  static propTypes = {
    label: React.PropTypes.string.isRequired,
    isSelected: React.PropTypes.bool.isRequired,
    id: React.PropTypes.string.isRequired,
    handleClick: React.PropTypes.func.isRequired,
  }

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

// ...................

export default class MenuTabs extends React.Component {
  static propTypes = {
    tabList: React.PropTypes.array.isRequired,
    currentMenuTab: React.PropTypes.string.isRequired,
    changeMenuTab: React.PropTypes.func.isRequired,
  }

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
