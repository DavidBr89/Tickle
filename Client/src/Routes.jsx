import React from 'react';
import {Route, HashRouter, Redirect, Switch} from 'react-router-dom';

import BookWidget from './components/BookWidgets';

import {
  MYCARDS,
  GEO_VIEW,
  TAG_VIEW,
  AUTHOR,
  ACCOUNT,
  GEO_AUTHOR,
  SIGN_UP,
  SIGN_IN,
  ADMIN,
  ADMIN_SIGN_UP,
  DATAVIEW
} from './constants/routeSpec';

import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Admin from './components/Admin';
import Account from './components/Account';
import Diary from './components/Diary';

// import CardTreeEditorPage from './components/CardTreeEditor';

import CardAuthorPage from './components/CardAuthor';
import UserEnvironmentSettings from './components/CardAuthor/UserEnvironmentSettings';

import {
  MapViewPage,
  TopicMapViewPage,
  SelectUserEnv,
  TagViewPage
} from './components/CardView';

import DefaultLayout from './components/DefaultLayout';

const NoMatch = () => (
  <DefaultLayout>
    <div className="content-margin">
      <h1>No Match</h1>
    </div>
  </DefaultLayout>
);

const defaultEnv = 'default';

/**
 * This function defines the routes for the whole app
 */
const Routes = () => (
  <HashRouter>
    <Switch>
      <Route
        path="/"
        exact
        render={() => (
          <Redirect to={`/${defaultEnv}/${SIGN_IN.path}`} />
        )}
      />

      <Route path={`/${MYCARDS.path}`} component={Diary} />
      <Route
        path={`/${AUTHOR.path}`}
        exact
        render={() => (
          <DefaultLayout>
            <UserEnvironmentSettings />
          </DefaultLayout>
        )}
      />
      <Route path={`/${GEO_AUTHOR.path}`} render={CardAuthorPage} />
      <Route
        exact
        path={`/${DATAVIEW.path}`}
        component={() => (
          <DefaultLayout>
            <SelectUserEnv />
          </DefaultLayout>
        )}
      />
      <Route exact path={`/${GEO_VIEW.path}`} component={MapViewPage} />
      <Route exact path={`/${TAG_VIEW.path}`} component={TagViewPage} />
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
        path="/bookwidget"
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
        path={`/${ADMIN.path}`}
        component={() => <Admin />}
      />
      <Route
        exact
        path={`/${ACCOUNT.path}`}
        component={() => <Account />}
      />

      <Route component={NoMatch} />
    </Switch>
  </HashRouter>
);

export default Routes;
