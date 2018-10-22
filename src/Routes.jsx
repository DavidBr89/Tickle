import React from 'react';
import {Route, HashRouter, Switch} from 'react-router-dom';

import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import LandingPage from './components/LandingPage';
import Home from './components/Home';
import CardView from './components/CardView';
import Admin from './components/Admin';
import Account from './components/Account';
import Diary from './components/Diary';

import {MapCardAuthorPage, TopicMapAuthorPage} from './components/CardAuthor';

import {MapViewPage, TopicMapViewPage} from './components/CardView';

// import MapAuthor from './components/DataView/Map/MapAuthor';

import DefaultLayout from './components/DefaultLayout';

import UserMap from 'Components/DataView/Map/UserMap';

import withAuthentication from './components/withAuthentication';
// import AuthUserContext from './components/AuthUserContext';

import {
  MYCARDS,
  GEO_VIEW,
  TAG_VIEW,
  TOPIC_VIEW,
  AUTHOR,
  ACCOUNT,
  GEO_AUTHOR,
  TAG_AUTHOR,
  TOPIC_AUTHOR,
  SIGN_UP,
  SIGN_IN,
  HOME,
  ADMIN,
  ADMIN_SIGN_UP,
  LANDING
} from 'Constants/routes';

// const GRID = 'grid';

// import history from './BrowserHistory';

// import Login from './components/Login';

const Routes = () => (
  <HashRouter>
    <Switch>
      <Route
        path={`${MYCARDS.path}/:selectedCardId?/:showOption?/:flipped?`}
        render={() => <Diary />}
      />
      <Route
        path={`${GEO_AUTHOR.path}/:selectedCardId?/:showOption?/:flipped?`}
        render={() => <MapCardAuthorPage />}
      />
      <Route
        path={`${TOPIC_AUTHOR.path}/:selectedCardId?/:showOption?/:flipped?`}
        render={() => <TopicMapAuthorPage />}
      />
      <Route
        exact
        path={`${TOPIC_VIEW.path}/:selectedCardId?/:showOption?/:flipped?`}
        render={() => <TopicMapViewPage />}
      />
      <Route
        exact
        path={`${GEO_VIEW.path}/:selectedCardId?/:showOption?/:flipped?`}
        render={() => (
          <CardView>
            {props => <UserMap {...props} className="absolute" />}
          </CardView>
        )}
      />
      <Route exact path={LANDING.path} render={() => <LandingPage />} />
      <Route
        exact
        path={SIGN_UP.path}
        component={() => <SignUp admin={false} />}
      />
      <Route
        exact
        path={ADMIN_SIGN_UP.path}
        component={() => (
          <DefaultLayout>
            <SignUp admin />
          </DefaultLayout>
        )}
      />
      <Route exact path={SIGN_IN.path} component={() => <SignIn />} />
      <Route
        exact
        path={HOME.path}
        component={() => (
          <DefaultLayout>
            <Home />
          </DefaultLayout>
        )}
      />
      <Route
        exact
        path={ADMIN.path}
        component={() => (
          <DefaultLayout>
            <Admin />
          </DefaultLayout>
        )}
      />
      <Route
        exact
        path={ACCOUNT.path}
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
