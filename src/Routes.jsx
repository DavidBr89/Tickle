import React from 'react';
import { Route, HashRouter, Switch } from 'react-router-dom';

import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import LandingPage from './components/LandingPage';
import Home from './components/Home';
import CardView from './components/CardView';
import CardAuthor from './components/CardAuthor';
import Admin from './components/Admin';
import Account from './components/Account';
import Diary from './components/Diary';

import TopicMapAuthor from './components/DataView/TopicMap/DragTopicMap';
import MapAuthor from './components/DataView/Map/MapAuthor';

import MapGL, { HTMLOverlay } from 'react-map-gl';

import DefaultLayout from './components/DefaultLayout';

import Grid from './components/DataView/GridView';

import UserMap from 'Components/DataView/CardView/UserMap';

import withAuthentication from './components/withAuthentication';
// import AuthUserContext from './components/AuthUserContext';

import * as routes from 'Constants/routes';
import { TAGS, GEO, FLOORPLAN } from 'Constants/dataViews';

// const GRID = 'grid';

// import history from './BrowserHistory';

// import Login from './components/Login';

const Routes = ({ history }) => (
  <HashRouter>
    <Switch>
      <Route
        path={`${routes.MYCARDS}/:selectedCardId?/:showOption?/:flipped?`}
        render={() => <Diary />}
      />
      <Route
        path={`${`${
          routes.AUTH_ENV
        }/${GEO}`}/:selectedCardId?/:showOption?/:flipped?`}
        render={() => (
          <CardAuthor dataView={GEO}>
            {props => <MapAuthor {...props} className="absolute" />}
          </CardAuthor>
        )}
      />
      <Route
        path={`${`${
          routes.AUTH_ENV
        }/${FLOORPLAN}`}/:selectedCardId?/:showOption?/:flipped?`}
        render={() => (
          <CardAuthor dataView={FLOORPLAN}>
            {props => <TopicMapAuthor {...props} />}
          </CardAuthor>
        )}
      />
      <Route
        exact
        path={`${
          routes.DATAVIEW
        }/${FLOORPLAN}/:selectedCardId?/:showOption?/:flipped?`}
        render={() => (
          <CardView>
            {props => <UserMap className="absolute" {...props} />}
          </CardView>
        )}
      />
      <Route
        exact
        path={`${
          routes.DATAVIEW
        }/${GEO}/:selectedCardId?/:showOption?/:flipped?`}
        render={() => (
          <CardView>
            {props => <UserMap {...props} className="absolute" />}
          </CardView>
        )}
      />
      <Route exact path={routes.LANDING} render={() => <LandingPage />} />
      <Route
        exact
        path={routes.SIGN_UP}
        component={() => <SignUp admin={false} />}
      />
      <Route
        exact
        path="/admin-signup"
        component={() => (
          <DefaultLayout>
            <SignUp admin />
          </DefaultLayout>
        )}
      />
      <Route exact path={routes.SIGN_IN} component={() => <SignIn />} />
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
