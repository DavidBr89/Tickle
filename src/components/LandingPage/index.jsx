import React from 'react';

import { Link, withRouter } from 'react-router-dom';

import * as routes from 'Constants/routes';

import AuthUserContext from '../AuthUserContext';

import SignOutButton from '../SignOut';

const styleButton = { background: 'whitesmoke', width: '80vw' };

const Navigation = () => (
  <AuthUserContext.Consumer>
    {authUser => (authUser ? <NavigationAuth /> : <NavigationNonAuth />)}
  </AuthUserContext.Consumer>
);

const NavigationAuth = () => (
  <ul>
    <div className="mt-3">
      <Link to={routes.MAP}>
        <button className="btn" style={styleButton}>
          <h1>Map</h1>
        </button>
      </Link>
    </div>
    <div className="mt-3">
      <button className="btn" style={styleButton}>
        <h1>Account</h1>
      </button>
    </div>
    <div className="mt-3">
      <button className="btn" style={styleButton}>
        <h1>Diary</h1>
      </button>
    </div>
  </ul>
);

const NavigationNonAuth = () => (
  <ul>
    <li>
      <h3>
        <Link to={routes.LANDING}>Home</Link>
      </h3>
    </li>
    <li>
      <h3>
        <Link to={routes.SIGN_IN}>Sign In</Link>
      </h3>
    </li>
  </ul>
);

const LandingPage = ({ onClick }) => {
  const clickHandler = () => {
    onClick();
  };

  return (
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
        width: '100vw',
        background: 'rgba(0, 0, 0, 0.3)'
      }}
    >
      <div>
        <h1 style={{ fontWeight: 'bold', fontSize: 100 }}>TICKLE</h1>
      </div>
      <Navigation />
    </div>
  );
};

export default LandingPage;
