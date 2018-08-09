import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { stylesheet } from 'Src/styles/GlobalThemeContext';
import { css } from 'aphrodite';
// import { Link } from 'react-router-dom';

// import SignOutButton from '../SignOut';

import Navigation from '../Navigation';

// import DocumentMeta from 'react-document-meta';

// import { findRoute } from '../utils';

// import userPic from './user.png';
// import cx from './MainLayout.scss';

const Menu = ({ style, children }) => (
  <div style={{ ...style }}>
    <nav
      className="navbar navbar-light "
      style={{
        zIndex: 5000
        // minWidth: '30%'
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
        background: 'white'
      }}
    >
      <div
        className={`p-3 ${css(stylesheet.border)}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        {children}
      </div>
    </div>
  </div>
);

class MainLayout extends Component {
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
    const { children, activePath, isAndroid } = this.props;

    // style={{ height: isAndroid ? '100vh' : '100vh' }}
    return (
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
    );
  }
}

const mapStateToProps = state => ({ ...state.Screen });

/*
exampleAction: authUser => {
    dispatch(setAuthUser(authUser));
  }
*/
const mergeProps = (stateProps, _, ownProps) => ({
  ...stateProps,
  ...ownProps
});

export default connect(
  mapStateToProps,
  null,
  mergeProps
)(MainLayout);
