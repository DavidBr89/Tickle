import React from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from './SignOut';
import * as routes from 'Constants/routes';

import AuthUserContext from './AuthUserContext';

// const zip= rows=>rows[0].map((_,c)=>rows.map(row=>row[c]))

const authRoutes = [routes.LANDING, routes.MAP, routes.ACCOUNT];
const authRoutesNames = ['Home', 'Map', 'Account'];

const nonAuthRoutes = [routes.LANDING, routes.SIGN_IN];
const nonAuthRoutesNames = ['Home', 'Sign-In'];

const Navigation = ({ children = d => d }) => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? (
        <NavigationAuth>{children}</NavigationAuth>
      ) : (
        <NavigationNonAuth>{children}</NavigationNonAuth>
      )
    }
  </AuthUserContext.Consumer>
);

const NavigationAuth = ({ children }) => (
  <React.Fragment>
    {authRoutes.map((r, i) => children(r, authRoutesNames[i]))}
  </React.Fragment>
);

const NavigationNonAuth = ({ children }) => (
  <React.Fragment>
    {nonAuthRoutes.map((r, i) => children(r, nonAuthRoutesNames[i]))}
  </React.Fragment>
);

export default Navigation;
