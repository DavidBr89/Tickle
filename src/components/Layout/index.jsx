import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { stylesheet } from 'Src/styles/GlobalThemeContext';
import { css } from 'aphrodite';
// import { Link } from 'react-router-dom';

// import SignOutButton from '../SignOut';

import Navigation from '../Navigation';

import { screenResize } from 'Reducers/Screen/actions';

// import DocumentMeta from 'react-document-meta';

// import { findRoute } from '../utils';

// import userPic from './user.png';
// import cx from './DefaultLayout.scss';

class Menu extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  // state = {
  //   open: false
  // };

  render() {
    const { style, open, children, onToggle } = this.props;
    return (
      <div style={{ ...style }}>
        <nav
          className="navbar navbar-light "
          style={{
            zIndex: 25000
            // minWidth: '30%'
            // filter: 'blur(10px)',

            // display: 'flex'
          }}
        >
          <button
            onClick={onToggle}
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
          className={`collapse w-100 ${open && 'show'}`}
          id="submenu"
          style={{
            position: 'relative',
            zIndex: 250000,
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
  }
}

class DefaultLayout extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    activePath: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  state = { open: false };

  handleClick = () => {
    this.setState(prevState => ({
      open: !prevState.open
    }));
  };

  componentDidMount() {
    const { screenResize } = this.props;
    const android = /(android)/i.test(navigator.userAgent);
    const iOS =
      !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

    screenResize({
      width: this.cont.offsetWidth,
      height: this.cont.offsetHeight,
      android,
      iOS
    });
  }

  render() {
    const { children, activePath, isAndroid } = this.props;
    const { open } = this.state;

    // style={{ height: isAndroid ? '100vh' : '100vh' }}
    return (
      <div id="content-container" ref={c => (this.cont = c)}>
        <Menu
          open={open}
          style={{ position: 'absolute' }}
          onToggle={this.handleClick}
        >
          <Navigation>
            {({ name }) => (
              <div
                onClick={() => {
                  this.setState({ open: false });
                }}
              >
                {name}
              </div>
            )}
          </Navigation>
        </Menu>
        {children}
      </div>
    );
  }
}

const mapStateToProps = state => ({ ...state.Screen });

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      screenResize
    },
    dispatch
  );

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DefaultLayout);
