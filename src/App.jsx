import React from 'react';
import thunkMiddleware from 'redux-thunk';

import {Provider} from 'react-redux';

import {hot, setConfig} from 'react-hot-loader';
// import withAuthentication from './components/withAuthentication';oo
// import AuthUserContext from './components/AuthUserContext';

// import {db} from 'Firebase';

import {createBrowserHistory} from 'history';
import {screenResize} from 'Reducers/Screen/actions';

import {userMove, changeMapViewport} from 'Reducers/Map/actions';
import store from './store';
import Routes from './Routes';

setConfig({pureSFC: true});
// db.readCopyUsers();

// TODO check whether it's only created once
const history = createBrowserHistory();

// db.readCopyUsers();

// debug('lego:routes');
const cardTemplateId = 'temp';

const geoOpts = {
  enableHighAccuracy: true,
  maximumAge: 3000,
  timeout: 27000,
};

const geoError = err => console.log('err', err);

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
    longitude: pos.coords.longitude,
  };

  // Oude Arendonkse Baan, Oud-Turnhout 51.313476, 5.001513
  //
  // const turnoud = { latitude: 51.313476, longitude: 5.001513 };
  // TODO: include back again
  // store.dispatch(userMove(coords));
  // store.dispatch(changeMapViewport(coords));
};

// TODO
navigator.geolocation.getCurrentPosition(
  pos => {
    const coords = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    };

    // Oude Arendonkse Baan, Oud-Turnhout 51.313476, 5.001513
    // const turnoud = { latitude: 51.313476, longitude: 5.001513 };
    store.dispatch(userMove(coords));
    store.dispatch(changeMapViewport(coords));
  },
  err => console.log('err', err),
  geoOpts,
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
