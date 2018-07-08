import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import SignOutButton from './SignOut';
import * as routes from 'Constants/routes';

import AuthUserContext from './AuthUserContext';

// const zip= rows=>rows[0].map((_,c)=>rows.map(row=>row[c]))

const authRoutes = [routes.LANDING, routes.MAP, routes.ADMIN];
const authRoutesNames = ['Home', 'Card View', 'Admin'];

const nonAuthRoutes = [routes.LANDING, routes.SIGN_IN];
const nonAuthRoutesNames = ['Home', 'Sign-In'];

const Navigation = ({ authUser, children }) => (
  <React.Fragment>
    {authUser ? (
      <NavigationAuth>{children}</NavigationAuth>
    ) : (
      <NavigationNonAuth>{children}</NavigationNonAuth>
    )}
  </React.Fragment>
);

const NavigationAuth = ({ children }) => (
  <React.Fragment>
    {authRoutes.map((r, i) => children(r, authRoutesNames[i]))}
    <SignOutButton />
  </React.Fragment>
);

const NavigationNonAuth = ({ children }) => (
  <React.Fragment>
    {nonAuthRoutes.map((r, i) => children(r, nonAuthRoutesNames[i]))}
  </React.Fragment>
);

const mapStateToProps = state => ({
  authUser: state.Session.authUser
});

export default connect(mapStateToProps)(Navigation);
