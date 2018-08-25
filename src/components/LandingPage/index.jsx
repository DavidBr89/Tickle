import React from 'react';

import { Link, withRouter } from 'react-router-dom';

import * as routes from 'Constants/routes';

import AuthUserContext from '../AuthUserContext';

import { css } from 'aphrodite';
// import SignOutButton from '../SignOut';

import { GlobalThemeConsumer, stylesheet } from 'Src/styles/GlobalThemeContext';

import MiniForce from 'Components/DataView/ForceOverlay/MiniForceCollide';
import CardMarker from 'Components/utils/PreviewMarker';

import { connect } from 'react-redux';

const Navigation = () => (
  <AuthUserContext.Consumer>
    {authUser => (authUser ? <NavigationAuth /> : <NavigationNonAuth />)}
  </AuthUserContext.Consumer>
);

const NavigationAuth = () => (
  <ul style={{ zIndex: 2000 }}>
    <div className="mt-3">
      <Link to={routes.DATAVIEW}>
        <button className={css(stylesheet.btn)} style={styleButton}>
          <h1>DataView</h1>
        </button>
      </Link>
    </div>
    <div className="mt-3">
      <button className={css(stylesheet.btn)} style={styleButton}>
        <h1>Account</h1>
      </button>
    </div>
  </ul>
);

const NavigationNonAuth = () => (
  <h3>
    <Link to={routes.SIGN_IN}>Sign In</Link>
  </h3>
);

/*
        <MiniForce
          data={d3.range(0, 50).map(d => ({ id: d }))}
          targetPos={[width / 2, 50]}
        >
          {d => <CardMarker x={d.x} y={d.y} />}
        </MiniForce>
*/

const LandingPage = ({ onClick, width }) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 3000,
      height: '100vh',
      width: '100vw'
      // background: 'rgba(0, 0, 0, 0.3)'
    }}
  >
    <div style={{ position: 'relative' }}>
      <div
        style={{
          transform: 'translate(-50%,100%)',
          position: 'absolute'
          // width: 300,
          // height: 300
        }}
      />
      <h1 style={{ fontWeight: 'bold', fontSize: 100, zIndex: 2000 }}>
        TICKLE
      </h1>
    </div>
    <h3 className={css(stylesheet.btn)} style={{ zIndex: 2000 }}>
      <Link to={routes.SIGN_IN}>Sign In</Link>
    </h3>
  </div>
);

const mapStateToProps = state => ({ ...state.Screen });

export default connect(mapStateToProps)(LandingPage);
