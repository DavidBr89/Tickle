import React from 'react';
import { Route, HashRouter, Switch } from 'react-router-dom';

import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import LandingPage from './components/LandingPage';
import Home from './components/Home';
import MapView from './components/MapView';
import DefaultLayout from './components/Layout';

import withAuthentication from './components/withAuthentication';
import AuthUserContext from './components/AuthUserContext';

import * as routes from 'Constants/routes';
// import Login from './components/Login';

const Routes = () => (
  <HashRouter>
    <Switch>
      <Route
        exact
        path={routes.MAP}
        render={() => (
          <DefaultLayout>
            <MapView />
          </DefaultLayout>
        )}
      />
      <Route
        exact
        path={routes.LANDING}
        render={() => (
          <DefaultLayout>
            <LandingPage />
          </DefaultLayout>
        )}
      />
      <Route
        exact
        path={routes.SIGN_UP}
        component={() => (
          <DefaultLayout>
            <SignUp />
          </DefaultLayout>
        )}
      />
      <Route
        exact
        path={routes.SIGN_IN}
        component={() => (
          <DefaultLayout>
            <SignIn />
          </DefaultLayout>
        )}
      />
      <Route
        exact
        path={routes.HOME}
        component={() => (
          <DefaultLayout>
            <Home />
          </DefaultLayout>
        )}
      />
    </Switch>
  </HashRouter>
);

export default withAuthentication(Routes);
