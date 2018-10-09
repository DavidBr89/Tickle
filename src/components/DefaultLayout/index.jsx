import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { stylesheet } from 'Src/styles/GlobalThemeContext';
import { Menu as MenuIcon } from 'react-feather';
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
    className: PropTypes.string,
    ui: PropTypes.node
  };

  static defaultProps = {
    children: <div>no content</div>,
    className: '',
    ui: <React.Fragment />
  };

  // state = {
  //   open: false
  // jhhhjj};

  render() {
    const { style, open, children, onToggle, ui } = this.props;
    return (
      <div
        className="z-50 w-full"
        style={{
          ...style,
          // TODO
          // zIndex: 30000
        }}
      >
        <nav className="navbar flex">
          <button
            onClick={onToggle}
            style={{
              background: 'whitesmoke',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className="navbar-toggler m-2 p-2 border cursor-pointer"
            type="button"
          >
            <MenuIcon
              size="30"
              color="grey"
              style={{ pointerEvents: 'inherit' }}
            />
          </button>
          <div className="flex-grow flex justify-end">{ui}</div>
        </nav>

        <div
          style={{
            position: 'relative',
            background: 'white',
            opacity: open ? 'show' : null,
            display: open ? 'block' : 'none'
          }}
        >
          <div
            className="p-3"
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
    const { children, activePath, menu } = this.props;
    const { open } = this.state;

    // style={{ height: isAndroid ? '100vh' : '100vh' }}
    return (
      <div id="content-container" ref={c => (this.cont = c)}>
        <div style={{ display: 'flex' }}>
          <Menu
            ui={menu}
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
        </div>
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
