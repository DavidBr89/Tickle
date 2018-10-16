import React from 'react';

import { Link, withRouter } from 'react-router-dom';

import * as routes from 'Constants/routes';

import AuthUserContext from '../AuthUserContext';

import { css } from 'aphrodite';
// import SignOutButton from '../SignOut';

import { GlobalThemeConsumer, stylesheet } from 'Src/styles/GlobalThemeContext';

import MiniForce from 'Components/DataView/ForceOverlay/MiniForceCollide';
import CardMarker from 'Components/utils/PreviewMarker';

import DefaultLayout from 'Components/DefaultLayout';

import { connect } from 'react-redux';

const LandingPage = ({ onClick, width }) => (
  <DefaultLayout >
    <div
      className="flex-grow flex flex-col items-center justify-center"
      style={{}}
    >
      <div style={{ position: 'relative' }}>
        <h1 style={{ fontWeight: 'bold', fontSize: 100, zIndex: 2000 }}>
          TICKLE
        </h1>
      </div>
      <div className="flex mb-1">
        <Link className="btn bg-white mr-1" to={routes.SIGN_IN}>
          Sign In
        </Link>
        <Link className="btn bg-white" to={routes.SIGN_UP}>
          Sign Up
        </Link>
      </div>
      <Link className="btn bg-white" to={routes.ADMIN_SIGN_UP}>
        ADMIN Sign Up
      </Link>
    </div>
  </DefaultLayout>
);

const mapStateToProps = state => ({ ...state.Screen });

export default connect(mapStateToProps)(LandingPage);
