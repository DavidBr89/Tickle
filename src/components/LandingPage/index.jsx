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
      height: '100%',
      width: '100%'
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
