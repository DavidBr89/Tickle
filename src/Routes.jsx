import React from 'react';
import {Route, HashRouter, Redirect, Switch} from 'react-router-dom';

import BookWidget from 'Components/BookWidgets';

import {
  MYCARDS,
  GEO_VIEW,
  TAG_VIEW,
  TOPIC_VIEW,
  AUTHOR,
  ACCOUNT,
  GEO_AUTHOR,
  TAG_AUTHOR,
  TREE_AUTHOR,
  SIGN_UP,
  SIGN_IN,
  HOME,
  ADMIN,
  ADMIN_SIGN_UP,
  LANDING,
  DATAVIEW,
} from 'Constants/routeSpec';

import SignUp from './components/SignUp';
import SignIn, {SignInRedirect} from './components/SignIn';
import Home from './components/Home';
import Admin from './components/Admin';
import Account from './components/Account';
import Diary from './components/Diary';

import CardTreeEditorPage from './components/CardTreeEditor';

import {
  MapCardAuthorPage,
  TopicMapAuthorPage,
  UserEnvironmentSettings,
} from './components/CardAuthor';

import {
  MapViewPage,
  TopicMapViewPage,
  SelectUserEnv,
  TagViewPage,
} from './components/CardView';

// import MapAuthor from './components/DataView/Map/MapAuthor';

import DefaultLayout from './components/DefaultLayout';

// import withAuthentication from './components/withAuthentication';
// import AuthUserContext from './components/AuthUserContext';

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
            params: {userEnv},
          },
        }) => <Redirect to={`/${userEnv}/${SIGN_IN.path}`} />}
      />
      <Route
        path="/"
        exact
        render={() => <Redirect to={`/staging/${SIGN_IN.path}`} />}
      />

      <Route path={`/:userEnv/${MYCARDS.path}/`} component={Diary} />
      <Route
        path={`/:userEnv/${AUTHOR.path}`}
        exact
        render={() => (
          <DefaultLayout>
            <UserEnvironmentSettings />
          </DefaultLayout>
        )}
      />

      <Route path={`/:userEnv/${GEO_AUTHOR.path}`} render={MapCardAuthorPage} />
      <Route
        path={`/:userEnv/${TREE_AUTHOR.path}`}
        component={CardTreeEditorPage}
      />

      <Route
        exact
        path={`/:userEnv/${DATAVIEW.path}/`}
        component={() => (
          <DefaultLayout>
            <SelectUserEnv />
          </DefaultLayout>
        )}
      />
      <Route
        exact
        path={`/:userEnv/${TOPIC_VIEW.path}`}
        component={TopicMapViewPage}
      />
      <Route
        exact
        path={`/:userEnv/${GEO_VIEW.path}`}
        component={MapViewPage}
      />
      <Route
        exact
        path={`/:userEnv/${TAG_VIEW.path}`}
        component={TagViewPage}
      />
      <Route
        exact
        path={`/:userEnv/${SIGN_UP.path}/:admin?`}
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
      <Route path={`/:userEnv/${SIGN_IN.path}`} component={SignIn} />
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
        path="/:userEnv/bookwidget"
        component={() => (
          <DefaultLayout>
            <div className="content-margin">
              <BookWidget />
            </div>
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
        path={`/:userEnv/${ACCOUNT.path}`}
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
