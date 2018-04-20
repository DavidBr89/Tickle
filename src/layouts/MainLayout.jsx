import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import DocumentMeta from 'react-document-meta';

// import { findRoute } from '../utils';

// import userPic from './user.png';
// import cx from './MainLayout.scss';

export default class MainLayout extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { isToggleOn: false };

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  render() {
    const { children } = this.props;

    return (
      <div id="main">
        <div className="layout__content">
          <div id="content-container">{children}</div>
        </div>
      </div>
    );
  }
}
