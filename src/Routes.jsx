import React from 'react';
import {Route, HashRouter, Redirect, Switch} from 'react-router-dom';

import SignUp from './components/SignUp';
import SignIn, {SignInRedirect} from './components/SignIn';
import LandingPage from './components/LandingPage';
import Home from './components/Home';
import CardView from './components/CardView';
import Admin from './components/Admin';
import Account from './components/Account';
import Diary from './components/Diary';
import TagView from './components/DataView/ForceOverlay/TreeMapCluster';

import {
  MapCardAuthorPage,
  TopicMapAuthorPage,
  UserEnvironmentSettings,
} from './components/CardAuthor';

import {MapViewPage, TopicMapViewPage} from './components/CardView';

// import MapAuthor from './components/DataView/Map/MapAuthor';

import DefaultLayout from './components/DefaultLayout';

import UserMap from 'Components/DataView/Map/UserMap';
// import withAuthentication from './components/withAuthentication';
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
  LANDING,
} from 'Constants/routeSpec';

const NoMatch = () => (
  <DefaultLayout>
    <div className="content-margin">
      <h1>No Match</h1>
    </div>
  </DefaultLayout>
);

// const GRID = 'grid';

// import history from './BrowserHistory';

// import Login from './components/Login';

const Routes = () => (
  <HashRouter>
    <Switch>
      <Route
        path="/:userEnv"
        exact
        render={({
          match: {
            params: {userEnv}
          }
        }) => <Redirect to={`/${userEnv}/${SIGN_IN.path}`} />}
      />
      <Route
        path="/"
        exact
        render={() => <Redirect to={`/staging/${SIGN_IN.path}`} />}
      />

      <Route path={`/:userEnv/${MYCARDS.path}/`} render={props => <Diary />} />

      <Route
        path={ `/:userEnv/${AUTHOR.path}` }
        exact
        render={() => (
          <DefaultLayout>
            <UserEnvironmentSettings />
          </DefaultLayout>
        )}
      />

      <Route
        path={`/:userEnv/${GEO_AUTHOR.path}`}
        render={props => <MapCardAuthorPage />}
      />
      <Route
        path={`/:userEnv/${TOPIC_AUTHOR.path}`}
        render={() => <TopicMapAuthorPage />}
      />
      <Route
        exact
        path={`/:userEnv/${TOPIC_VIEW.path}`}
        render={() => <TopicMapViewPage />}
      />
      <Route
        exact
        path={`/:userEnv/${GEO_VIEW.path}`}
        render={() => (
          <CardView>
            {props => <UserMap {...props} className="absolute" />}
          </CardView>
        )}
      />
      <Route
        exact
        path={`/:userEnv/${TAG_VIEW.path}`}
        render={() => (
          <CardView>
            {props => <TagView {...props} className="absolute" />}
          </CardView>
        )}
      />
      <Route
        exact
        path={`/:userEnv/:admin?/${SIGN_UP.path}`}
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
      <Route path={`/:userEnv/${SIGN_IN.path}`} component={() => <SignIn />} />
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

      <Route component={NoMatch} />
    </Switch>
  </HashRouter>
);

export default Routes;
