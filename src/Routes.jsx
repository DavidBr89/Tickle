import React from 'react';
import { Route, HashRouter, Switch } from 'react-router-dom';

import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import LandingPage from './components/LandingPage';
import Home from './components/Home';
import MapView from './components/MapView';
import Admin from './components/Admin';
import DefaultLayout from './components/Layout';

import withAuthentication from './components/withAuthentication';
import AuthUserContext from './components/AuthUserContext';

import * as routes from 'Constants/routes';
import { TAGS, GEO, FLOORPLAN } from 'Constants/dataViews';

// import Login from './components/Login';

const Routes = () => (
  <HashRouter>
    <Switch>
      <Route
        exact
        path={routes.AUTH_ENV}
        render={() => (
          <DefaultLayout activePath={routes.AUTH_ENV_TAGS}>
            <MapView dataView={TAGS} authEnv />
          </DefaultLayout>
        )}
      />
      <Route
        exact
        path={routes.AUTH_ENV_GEO}
        render={() => (
          <DefaultLayout activePath={routes.AUTH_ENV_GEO}>
            <MapView dataView={GEO} authEnv />
          </DefaultLayout>
        )}
      />
      <Route
        exact
        path={routes.AUTH_ENV_TAGS}
        render={() => (
          <DefaultLayout activePath={routes.AUTH_ENV_TAGS}>
            <MapView dataView={TAGS} authEnv />
          </DefaultLayout>
        )}
      />
      <Route
        exact
        path={routes.AUTH_ENV_FLOORPLAN}
        render={() => (
          <DefaultLayout activePath={routes.AUTH_ENV_FLOORPLAN}>
            <MapView dataView={FLOORPLAN} authEnv />
          </DefaultLayout>
        )}
      />
      <Route
        exact
        path={routes.DATAVIEW_GEO}
        render={() => (
          <DefaultLayout activePath={routes.DATAVIEW_GEO}>
            <MapView dataView={GEO} />
          </DefaultLayout>
        )}
      />
      <Route
        exact
        path={`${routes.DATAVIEW}`}
        render={() => (
          <DefaultLayout activePath={routes.DATAVIEW_TAGS}>
            <MapView dataView={TAGS} />
          </DefaultLayout>
        )}
      />
      <Route
        exact
        path={routes.DATAVIEW_TAGS}
        render={() => (
          <DefaultLayout activePath={routes.DATAVIEW_TAGS}>
            <MapView dataView={TAGS} />
          </DefaultLayout>
        )}
      />
      <Route
        exact
        path={routes.DATAVIEW_FLOORPLAN}
        render={() => (
          <DefaultLayout activePath={routes.DATAVIEW_FLOORPLAN}>
            <MapView dataView={FLOORPLAN} />
          </DefaultLayout>
        )}
      />
      <Route
        exact
        path={routes.LANDING}
        render={() => (
          <DefaultLayout activePath={routes.LANDING}>
            <LandingPage />
          </DefaultLayout>
        )}
      />
      <Route
        exact
        path={routes.SIGN_UP}
        component={() => (
          <DefaultLayout activePath={routes.SIGN_UP}>
            <SignUp />
          </DefaultLayout>
        )}
      />
      <Route
        exact
        path={routes.SIGN_IN}
        component={() => (
          <DefaultLayout activePath={routes.SIGN_IN}>
            <SignIn />
          </DefaultLayout>
        )}
      />
      <Route
        exact
        path={routes.HOME}
        component={() => (
          <DefaultLayout activePath={routes.HOME}>
            <Home />
          </DefaultLayout>
        )}
      />
      <Route
        exact
        path={routes.ADMIN}
        component={() => (
          <DefaultLayout>
            <Admin />
          </DefaultLayout>
        )}
      />
    </Switch>
  </HashRouter>
);

export default withAuthentication(Routes);
