import React from 'react';
import { Route, HashRouter, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import LandingPage from './components/LandingPage';
import Home from './components/Home';
import CardView from './components/MapView/CardView';
import CardAuthor from './components/MapView/CardAuthor';
import Admin from './components/Admin';
import DefaultLayout from './components/Layout';

import withAuthentication from './components/withAuthentication';
// import AuthUserContext from './components/AuthUserContext';

import * as routes from 'Constants/routes';
import { TAGS, GEO, FLOORPLAN } from 'Constants/dataViews';

import history from './BrowserHistory';

// import Login from './components/Login';

const Routes = () => (
  <ConnectedRouter history={history}>
    <div>
      <HashRouter>
        <Switch>
          <Route
            exact
            path={routes.AUTH_ENV}
            render={() => (
              <DefaultLayout>
                <CardAuthor dataView={TAGS} />
              </DefaultLayout>
            )}
          />
          <Route
            exact
            path={routes.AUTH_ENV_GEO}
            render={() => (
              <DefaultLayout>
                <CardAuthor dataView={GEO} />
              </DefaultLayout>
            )}
          />
          <Route
            exact
            path={routes.AUTH_ENV_TAGS}
            render={() => (
              <DefaultLayout>
                <CardAuthor dataView={TAGS} />
              </DefaultLayout>
            )}
          />
          <Route
            exact
            path={routes.AUTH_ENV_FLOORPLAN}
            render={() => (
              <DefaultLayout>
                <CardAuthor dataView={FLOORPLAN} />
              </DefaultLayout>
            )}
          />
          <Route
            exact
            path={routes.DATAVIEW_GEO}
            render={() => (
              <DefaultLayout>
                <CardView dataView={GEO} />
              </DefaultLayout>
            )}
          />
          <Route
            exact
            path={routes.DATAVIEW}
            render={() => (
              <DefaultLayout>
                <CardView dataView={TAGS} />
              </DefaultLayout>
            )}
          />
          <Route
            exact
            path={routes.DATAVIEW_TAGS}
            render={() => (
              <DefaultLayout>
                <CardView dataView={TAGS} />
              </DefaultLayout>
            )}
          />
          <Route
            exact
            path={routes.DATAVIEW_FLOORPLAN}
            render={() => (
              <DefaultLayout>
                <CardView dataView={FLOORPLAN} />
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
    </div>
  </ConnectedRouter>
);

export default withAuthentication(Routes);
