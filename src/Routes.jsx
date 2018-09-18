import React from 'react';
import { Route, HashRouter, Switch } from 'react-router-dom';

import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import LandingPage from './components/LandingPage';
import Home from './components/Home';
import CardView from './components/DataView/CardView';
import CardAuthor from './components/DataView/CardAuthor';
import Admin from './components/Admin';
import Account from './components/Account';
import Diary from './components/MyCards';
import DefaultLayout from './components/Layout';

import Grid from './components/DataView/GridView';

import withAuthentication from './components/withAuthentication';
// import AuthUserContext from './components/AuthUserContext';

import * as routes from 'Constants/routes';
import { TAGS, GEO, FLOORPLAN } from 'Constants/dataViews';

const GRID = 'grid';

// import history from './BrowserHistory';

// import Login from './components/Login';

const Routes = ({ history }) => (
  <HashRouter>
    <Switch>
      <Route
        path={`${routes.MYCARDS}/:selectedCardId?/:extended?/:flipped?`}
        render={() => <Diary />}
      />
      <Route
        path={`${`${
          routes.AUTH_ENV
        }/${TAGS}`}/:selectedCardId?/:extended?/:flipped?`}
        render={() => (
          <DefaultLayout>
            <CardAuthor dataView={TAGS} />
          </DefaultLayout>
        )}
      />
      <Route
        path={`${`${
          routes.AUTH_ENV
        }/${GEO}`}/:selectedCardId?/:extended?/:flipped?`}
        render={() => (
          <DefaultLayout>
            <CardAuthor dataView={GEO} />
          </DefaultLayout>
        )}
      />
      <Route
        exact
        path={`${`${
          routes.AUTH_ENV
        }/${FLOORPLAN}`}/:selectedCardId?/:extended?/:flipped?`}
        render={() => (
          <DefaultLayout>
            <CardAuthor dataView={FLOORPLAN} />
          </DefaultLayout>
        )}
      />
      <Route
        exact
        path={`${`${
          routes.AUTH_ENV
        }/${FLOORPLAN}`}/:selectedCardId?/:extended?/:flipped?`}
        render={() => (
          <DefaultLayout>
            <CardAuthor dataView={FLOORPLAN} />
          </DefaultLayout>
        )}
      />
      <Route
        exact
        path={`${
          routes.DATAVIEW
        }/${GEO}/:selectedCardId?/:showOption?/:flipped?`}
        render={() => (
          <DefaultLayout>
            <CardView dataView={GEO} />
          </DefaultLayout>
        )}
      />
      <Route
        exact
        path={`${
          routes.DATAVIEW
        }/${GRID}/:selectedCardId?/:extended?/:flipped?`}
        render={() => (
          <DefaultLayout>
            <Grid />
          </DefaultLayout>
        )}
      />
      <Route
        path={`${routes.DATAVIEW_TAGS}/:selectedCardId?/:extended?/:flipped?`}
        render={() => (
          <DefaultLayout>
            <CardView dataView={TAGS} path={routes.DATAVIEW_TAGS} />
          </DefaultLayout>
        )}
      />
      <Route
        path={`${routes.DATAVIEW}/:selectedCardId?/:extended?/:flipped?`}
        render={() => (
          <DefaultLayout>
            <CardView path={routes.DATAVIEW} dataView={FLOORPLAN} />
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
      <Route
        exact
        path={routes.ACCOUNT}
        component={() => (
          <DefaultLayout>
            <Account />
          </DefaultLayout>
        )}
      />
    </Switch>
  </HashRouter>
);

export default withAuthentication(Routes);
