import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {bindActionCreators} from 'redux';

import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import MenuIcon from 'react-feather/dist/icons/menu';

import {screenResize} from 'Reducers/Screen/actions';
import IcAk from 'Styles/alphabet_icons/ic_ak.svg';
import RouteNavigation from '../Navigation';

class NavBar extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    ui: PropTypes.node,
  };

  static defaultProps = {
    children: <div>no content</div>,
    className: '',
    ui: <React.Fragment />,
  };

  // state = {
  //   open: false
  // jhhhjj};

  render() {
    const {style, open, children, onToggle, ui, className} = this.props;
    return (
      <div className={`relative z-50 w-full ${className}`} style={{...style}}>
        <div
          className="navbar flex items-center relative m-2 "
          style={{minHeight: 48}}>
          <button
            className="border-4 border-black cursor-pointer p-2 z-50 flex-col-wrapper items-center bg-white"
            onClick={onToggle}
            type="button">
            <img src={IcAk} className="m-1" />
          </button>
          {ui}
        </div>
        <div
          className="ml-2 bg-white shadow border-2 border-black"
          style={{
            position: 'absolute',
            width: '80vw',
            maxWidth: 250,
            transition: 'transform 200ms',
            transform: `translateX( ${open ? 0 : -153}% )`,
          }}>
          <div
            className="p-3"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
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
    activePath: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  state = {open: false};

  handleClick = () => {
    this.setState(prevState => ({
      open: !prevState.open,
    }));
  };

  componentDidMount() {
    const {screenResize} = this.props;
    const android = /(android)/i.test(navigator.userAgent);
    const iOS =
      !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

    screenResize({
      width: this.cont.offsetWidth,
      height: this.cont.offsetHeight,
      android,
      iOS,
    });
  }

  render() {
    const {children, activePath, userEnv, menu, className, style} = this.props;
    const {open} = this.state;

    // style={{ height: isAndroid ? '100vh' : '100vh' }}
    return (
      <div
        id="content-container"
        ref={c => (this.cont = c)}
        style={style}
        className={className}>
        <div style={{display: 'flex'}}>
          <NavBar
            ui={menu}
            open={open}
            style={{position: 'absolute'}}
            onToggle={this.handleClick}>
            <div className="text-xl font-bold uppercase mb-2">{userEnv}</div>
            <RouteNavigation>
              {({name}) => (
                <div
                  onClick={() => {
                    this.setState({open: false});
                  }}>
                  {name}
                </div>
              )}
            </RouteNavigation>
          </NavBar>
        </div>
        {children}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state.Screen,
  userEnv: state.Session.selectedUserEnvId,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      screenResize,
    },
    dispatch,
  );

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(DefaultLayout);
