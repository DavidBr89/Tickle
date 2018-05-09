import React from 'react';
import thunkMiddleware from 'redux-thunk';

// import tsnejs from 'tsne';

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
import Login from './components/Login';

import DefaultLayout from './layouts/MainLayout';

import { dummyCards } from './dummyData';

import {
  fetchCards,
  fetchAuthoredCards,
  fetchNearByPlaces
} from './async_actions';

const loggerMiddleware = createLogger();

function gravatar(email) {
  const base = 'http://www.gravatar.com/avatar/';
  const hash = md5(email.trim().toLowerCase());
  return base + hash;
}

const defaultLocation = {
  latitude: 50.85146,
  longitude: 4.315483,
  radius: 500
};

const defaultCards = [...dummyCards];
const mapZoom = 9;
const [width, height] = [100, 100];
// debug('lego:routes');
const defaultState = {
  width,
  height,
  mapZoom,
  centerLocation: defaultLocation,
  defaultZoom: mapZoom,
  user: {
    name: 'jan',
    email: 'jmaushag@gmail.com',
    img: gravatar('jmaushag@gmail.com')
  },
  Login: {
    height,
    width,
    centerLocation: defaultLocation,
    mapZoom,
    challenges: []
  },
  MapView: {
    mapViewport: {},
    // TODO: calc value
    isCardDragging: false,
    latCenterOffset: 0.0018,
    latBottom: 0.003,
    defaultZoom: mapZoom,
    cards: [],
    defaultCards,
    zoom: mapZoom,
    direction: null,
    ...defaultLocation,
    userLocation: defaultLocation,
    height: 100,
    width: 100,
    cardChallengeOpen: false,
    extCardId: false,
    AppOpenFirstTime: true,
    selectedCardId: null, // dummyCards[0].id,
    birdsEyeView: false,
    gridView: true,
    tsneView: false,
    tagListView: false,
    selectedTags: [],
    isSearching: false,
    authEnv: false
  },
  CardCreator: {
    cards: dummyCards,
    userLocation: defaultLocation,
    width,
    height,
    mapViewport: { ...defaultLocation, zoom: mapZoom },
    selectedCardId: null,
    cardTemplate: {
      id: 'temp',
      template: true,
      loc: defaultLocation,
      edit: true,
      tags: []
    },
    defaultLocation,
    throttle: false,
    challenges: []
  }
};

function configureStore(rootReducer, initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      thunkMiddleware, // lets us dispatch() functions
      process.env.NODE_ENV === 'development' && loggerMiddleware // neat middleware that logs actions
    )
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./rootReducer', () => {
      const nextRootReducer = require('./rootReducer');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

const store = configureStore(rootReducer, defaultState);

// window.addEventListener('load', () => {
//   store.dispatch(
//     actions.screenResize({
//       width: window.innerWidth,
//       height: window.innerHeight
//     })
//   );
// });
//

store.dispatch(fetchAuthoredCards(0));
store.dispatch(fetchNearByPlaces());

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
