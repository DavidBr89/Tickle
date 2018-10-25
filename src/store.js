import {createStore, applyMiddleware, compose} from 'redux';
import {createLogger} from 'redux-logger';

import thunkMiddleware from 'redux-thunk';

import rootReducer from './reducers';

import {DB} from 'Firebase';

// const defaultCards = [...dummyCards];
const mapZoom = 9;
const [width, height] = [100, 100];

const defaultLocation = {
  latitude: 50.85146,
  longitude: 4.315483,
  radius: 500
};

const defaultState = {
  width,
  height,
  mapZoom,
  centerLocation: defaultLocation,
  defaultZoom: mapZoom,
  user: {
    name: 'jan',
    email: 'jmaushag@gmail.com',
    // img: gravatar('jmaushag@gmail.com'),
    userLocation: defaultLocation
  },
  Login: {
    height,
    width,
    centerLocation: defaultLocation,
    mapZoom,
    challenges: []
  }
  // MapView: {
  //   mapViewport: {},
  //   // TODO: calc value
  //   latCenterOffset: 0.0018,
  //   latBottom: 0.003,
  //   defaultZoom: mapZoom,
  //   zoom: mapZoom,
  //   direction: null,
  //   ...defaultLocation,
  //   userLocation: defaultLocation,
  //   height: 100,
  //   width: 100
  // },
  // Session: {
  //   authUser: { uid: null }
  // } // DataView: {
  //   dataView: 'topic',
  //   tsneView: false,
  //   gridView: true,
  //   authEnv: true,
  //   searchString: null
  // }
};

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    })
    : compose;

function configureStore(rootReducer, initialState) {
  // TODO: remove for production
  const setMiddleWare = () => {
    const loggerMiddleware = createLogger();
    if (process.env.NODE_ENV === 'development') {
      return applyMiddleware(thunkMiddleware, loggerMiddleware);
    }
    return applyMiddleware(thunkMiddleware);
  };

  const enhancer = composeEnhancers(setMiddleWare());

  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

const store = configureStore(rootReducer);

export default store;
