import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

// import { Link } from 'react-router-dom';

// import SignOutButton from '../SignOut';

import Navigation from '../Navigation';

// import DocumentMeta from 'react-document-meta';

// import { findRoute } from '../utils';

// import userPic from './user.png';
// import cx from './MainLayout.scss';

function Menu({ style, children }) {
  return (
    <div style={style}>
      <nav
        className="navbar navbar-light"
        style={{
          zIndex: 4000
          // filter: 'blur(10px)',

          // display: 'flex'
        }}
      >
        <button
          style={{ background: 'whitesmoke' }}
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#submenu"
          aria-controls="submenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
      </nav>
      <div
        className="collapse w-100"
        id="submenu"
        style={{
          position: 'relative',
          zIndex: 4000,
          background: 'whitesmoke'
        }}
      >
        <div
          className="p-3"
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default class MainLayout extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    activePath: PropTypes.string
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
    const { children, activePath } = this.props;

    return (
      <div id="main">
        <div className="layout__content">
          <div id="content-container">
            <Menu style={{ position: 'absolute' }}>
              <Navigation activePath={activePath}>
                {(r, name) => (
                  <Link className="btn mb-2" to={r}>
                    {name}
                  </Link>
                )}
              </Navigation>
            </Menu>
            {children}
          </div>
        </div>
      </div>
    );
  }
}
