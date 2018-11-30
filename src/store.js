import {createStore, applyMiddleware, compose} from 'redux';
import {createLogger} from 'redux-logger';

import thunkMiddleware from 'redux-thunk';

import rootReducer from './reducers';
import {saveState, loadState} from './localStorage';

import {DB} from 'Firebase';
import throttle from 'lodash/throttle';

// localStorage.clear();
// const defaultCards = [...dummyCards];
const mapZoom = 9;
const [width, height] = [100, 100];

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

const persistedState = loadState();
const store = configureStore(rootReducer, persistedState);

store.subscribe(
  throttle(() => {
    saveState({
      Session: {
        ...store.getState().Session,
        // authUser: store.getState().Session.authUser
      },
    });
  }),
  1000,
);

export default store;
