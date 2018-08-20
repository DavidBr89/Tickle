import React from 'react';
import thunkMiddleware from 'redux-thunk';

import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import { Provider } from 'react-redux';

import { connectRouter, routerMiddleware } from 'connected-react-router';

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

import { screenResize } from 'Reducers/Screen/actions';

import history from './BrowserHistory';

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
      return applyMiddleware(
        thunkMiddleware,
        loggerMiddleware,
        routerMiddleware(history)
      );
    }
    return applyMiddleware(thunkMiddleware, routerMiddleware(history));
  };

  const enhancer = composeEnhancers(setMiddleWare());

  const store = createStore(
    connectRouter(history)(rootReducer),
    initialState,
    enhancer
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

const store = configureStore(rootReducer, defaultState);

window.addEventListener('load', () => {
  const cont = document.querySelector('#content-container');
  const android = /(android)/i.test(navigator.userAgent);
  const iOS =
    !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

  store.dispatch(
    screenResize({
      width: cont.offsetWidth,
      height: cont.offsetHeight,
      android,
      iOS
    })
  );
});
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

// db.readCopyOlga();

export default hot(module)(App);
