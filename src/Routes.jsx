import React from 'react';
import thunkMiddleware from 'redux-thunk';

import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { Provider } from 'react-redux';

import {
  // Router,
  Route,
  // hashHistory,
  // IndexRoute,
  // Link,
  HashRouter,
  Switch
} from 'react-router-dom';
// import debug from 'debug';

import md5 from 'blueimp-md5';
import rootReducer from './rootReducer';

import MapView from './components/MapView';
import CardCreator from './components/CardCreator';
import Generator from './components/Generator';
import Login from './components/Login';

import DefaultLayout from './layouts/MainLayout';

import { dummyCards } from './dummyData';

const loggerMiddleware = createLogger();

// import NotFound from './containers/NotFound/NotFound';

function gravatar(email) {
  const base = 'http://www.gravatar.com/avatar/';
  const hash = md5(email.trim().toLowerCase());
  return base + hash;
}

const defaultLocation = {
  latitude: 50.85146,
  longitude: 4.315483
};
const mapZoom= 8;
const {width, height} = {width: 100, height: 100};
// debug('lego:routes');
const defaultState = {
  width,
  height,
  mapZoom,
  centerLocation: defaultLocation,
  user: {
    name: 'jan',
    email: 'jmaushag@gmail.com',
    img: gravatar('jmaushag@gmail.com')
  },
  Login: {
    height,
    width,
    centerLocation: defaultLocation,
    mapZoom
  },
  MapView: {
    cards: dummyCards,
    mapZoom,
    centerLocation: defaultLocation,
    userLocation: defaultLocation,
    selectedCardId: null,
    height: 100,
    width: 100,
    defaultHeight: 100,
    gridWidth: 100,
    maxHeight: 100,
    minHeight: 100,
    mapHeight: 100,
    gridHeight: 100,
    cardChallengeOpen: false,
    extCardId: false,
    AppOpenFirstTime: true
  },
  CardCreator: {
    cards: dummyCards,
    width,
    height,
    mapViewport: { ...defaultLocation, zoom: mapZoom },
    selectedCardId: null,
    cardTemplateOpen: false,
    cardTemplate: {}
  }
};

const store = createStore(
  rootReducer,
  defaultState,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
);

// window.addEventListener('load', () => {
//   store.dispatch(
//     actions.screenResize({
//       width: window.innerWidth,
//       height: window.innerHeight
//     })
//   );
// });

const Routes = () => (
  <HashRouter>
    <Switch>
      <Route
        exact
        path="/"
        render={() => (
          <DefaultLayout>
            <Provider store={store}>
              <MapView />
            </Provider>
          </DefaultLayout>
        )}
      />
      <Route
        exact
        path="/cardcreator"
        render={() => (
          <DefaultLayout>
            <Provider store={store}>
              <CardCreator />
            </Provider>
          </DefaultLayout>
        )}
      />
      <Route
        exact
        path="/generator"
        render={() => (
          <DefaultLayout>
            <Provider store={store}>
              <Generator />
            </Provider>
          </DefaultLayout>
        )}
      />
      <Route
        exact
        path="/login"
        render={() => (
          <DefaultLayout>
            <Provider store={store}>
              <Login />
            </Provider>
          </DefaultLayout>
        )}
      />
    </Switch>
  </HashRouter>
);

export default Routes;
