import React from 'react';
import thunkMiddleware from 'redux-thunk';

import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import { Provider } from 'react-redux';

import { hot } from 'react-hot-loader';
// import withAuthentication from './components/withAuthentication';oo
// import AuthUserContext from './components/AuthUserContext';

import { db } from 'Firebase';

import rootReducer from './reducers';
import Routes from './Routes';
import * as chromatic from 'd3-scale-chromatic';

import chroma from 'chroma-js';

// import Login from './components/Login';

// import { dummyCards } from './dummyData';

// import {
//   fetchCards,
//   fetchAuthoredCards,
//   fetchNearByPlaces
// } from './reducers/Cards/async_actions';

import { createBrowserHistory } from 'history';
import { screenResize } from 'Reducers/Screen/actions';

import { userMove, changeMapViewport } from 'Reducers/Map/actions';

// TODO check whether it's only created once
const history = createBrowserHistory();

const defaultLocation = {
  latitude: 50.85146,
  longitude: 4.315483,
  radius: 500
};

// const defaultCards = [...dummyCards];
const mapZoom = 9;
const [width, height] = [100, 100];
// debug('lego:routes');
const cardTemplateId = 'temp';

const tagColors = chromatic.schemeSet3
  .reverse()
  .map(c => chroma(c).alpha(0.04));

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

const geoOpts = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 27000
};

const geoError = err => console.log('err', err);

const store = configureStore(rootReducer);

// window.addEventListener('DOMContentLoaded', () => {
//   //TODO
//   //TODO
//   //TODO
//   //TODO
//   //TODO
//   //TODO
//   const cont = document.querySelector('#content-container');
// });

// TODO: Only inline function work with hot reloading

const geoSuccess = pos => {
  const coords = {
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude
  };

  // Oude Arendonkse Baan, Oud-Turnhout 51.313476, 5.001513
  // const turnoud = { latitude: 51.313476, longitude: 5.001513 };
  store.dispatch(userMove(coords));
  // store.dispatch(changeMapViewport(coords));
};

// TODO
navigator.geolocation.getCurrentPosition(
  pos => {
    const coords = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude
    };

    // Oude Arendonkse Baan, Oud-Turnhout 51.313476, 5.001513
    // const turnoud = { latitude: 51.313476, longitude: 5.001513 };
    store.dispatch(userMove(coords));
    store.dispatch(changeMapViewport(coords));
  },
  err => console.log('err', err),
  geoOpts
);

navigator.geolocation.watchPosition(geoSuccess, geoError, geoOpts);

//
// window.addEventListener('resize', () => {
//   const cont = document.querySelector('#content-container');
//   console.log('resize');
//   const isAndroid = /(android)/i.test(navigator.userAgent);
//   store.dispatch(
//     screenResize({
//       width: cont.offsetWidth,
//       height: cont.offsetHeight,
//       isAndroid
//     })
//   );
// });

// store.dispatch(fetchAuthoredCards(0));
// store.dispatch(fetchNearByPlaces());

// const withAuthentication = Component =>
//   class WithAuthentication extends React.Component {
//     constructor(props) {
//       super(props);
//
//       this.state = {
//         authUser: null
//       };
//     }
//
//     componentDidMount() {
//       firebase.auth.onAuthStateChanged(authUser => {
//         authUser
//           ? this.setState(() => ({ authUser }))
//           : this.setState(() => ({ authUser: null }));
//       });
//     }
//
//     render() {
//       const { authUser } = this.state;
//
//       return (
//         <AuthUserContext.Provider value={authUser}>
//           <Component />
//         </AuthUserContext.Provider>
//       );
//     }
//   };

const App = () => (
  <Provider store={store}>
    <Routes history={history} />
  </Provider>
);

// PbQiWWDMJgYCnl6vhK8fkMhWe4y2
// db.getOneUser('PbQiWWDMJgYCnl6vhK8fkMhWe4y2');
// db.readCopyOlga();

export default hot(module)(App);
