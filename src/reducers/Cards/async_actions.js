import generate from 'firebase-auto-ids';

import fetch from 'cross-fetch';

import {
  receivePlaces,
  receiveReadableCards,
  receiveCreatedCards,
  receiveCardTemplates,
  createCard,
  createCardSuccess,
  deleteCard,
  deleteCardSuccess,
  deleteCardError
} from './actions';

import NearbyPlaces from '../places.json';

import {
  // WebMercatorViewport,
  PerspectiveMercatorViewport
} from 'viewport-mercator-project';

import { db, firebase } from 'Firebase';

import gapi from './gapi';

const gen = new generate.Generator();

// export const REQUEST_CHALLENGES = 'REQUEST_CHALLENGES';
// function requestChallenges(subreddit) {
//   return {
//     type: REQUEST_CHALLENGES,
//     subreddit
//   };
// }
// export const RECEIVE_CHALLENGES = 'RECEIVE_CHALLENGES';
// function receiveCards(json) {
//   return {
//     type: RECEIVE_CHALLENGES,
//     challenges: json,
//     receivedAt: Date.now()
//   };
// }

// export const SCREEN_RESIZE = 'SCREEN_RESIZE_jan';
// export function screenResize(options) {
//   return { type: SCREEN_RESIZE, options };
// }

// TODO: remove
gapi.load('client', () => {
  const discoveryUrl =
    'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest';

  // Initialize the gapi.client object, which app uses to make API requests.
  // Get API key and client ID from API Console.
  // 'scope' field specifies space-delimited list of access scopes.
  gapi.client
    .init({
      apiKey: process.env.GoogleAccessToken,
      discoveryUrl
      // discoveryDocs: [discoveryUrl]
      // clientId:
      //   '655124348640-ip7r33kh1vt5lbc2h5rij96mku6unreu.apps.googleusercontent.com',
      // scope: SCOPE
    })
    .then(() =>
      gapi.client
        .request({
          path: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
          params: {}
        })
        .execute(
          d => console.log('hey rexxxx', d),
          err => console.log('err', err)
        )
    );
});

export function fetchReadableCards(uid) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.
  return function(dispatch) {
    // TODO: change later
    return db.readCards(uid, 'createdCards').then(querySnapshot => {
      const data = [];
      querySnapshot.forEach(doc => data.push(doc.data()));
      dispatch(receiveReadableCards(data));
    });
  };
}

export function fetchCreatedCards(uid) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.
  return function(dispatch) {
    return db.readCards(uid, 'createdCards').then(querySnapshot => {
      const data = [];
      querySnapshot.forEach(doc => data.push(doc.data()));
      dispatch(receiveCreatedCards(data));
    });
  };
}

export function fetchCardTemplates(uid) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.
  return function(dispatch) {
    return firebase.firestore
      .collection('users')
      .doc(uid)
      .collection('authoredCards')
      .get()
      .then(querySnapshot => {
        const data = [];
        querySnapshot.forEach(doc => data.push({ ...doc.data(), id: doc.id }));
        dispatch(receiveCreatedCards(data));
      });
  };
}

export function asyncCreateCard({ cardData, mapViewport, uid }) {
  const { x, y, tx, ty, vx, vy, ...restData } = cardData;

  // console.log('restData', restData);
  const vp = new PerspectiveMercatorViewport(mapViewport);

  const [longitude, latitude] = vp.unproject([x, y]);

  //
  const newCard = {
    ...restData,
    loc: { latitude, longitude },
    template: false,
    // TODO: change
    id: gen.generate(Date.now())
  };

  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.
  return function(dispatch) {
    dispatch(createCard(newCard));
    return db.doCreateCard(uid, newCard).then(querySnapshot => {
      dispatch(createCardSuccess(newCard));
    });
  };
}

export function asyncRemoveCard({ uid, cid }) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.
  console.log('async remove card');
  return function(dispatch) {
    dispatch(deleteCard(cid));
    return db.doDeleteCard(uid, cid).then(querySnapshot => {
      dispatch(deleteCardSuccess(cid));
    });
  };
}

// export function computeTSNE(userid) {
//   // Thunk middleware knows how to handle functions.
//   // It passes the dispatch method as an argument to the function,
//   // thus making it able to dispatch actions itself.
//   return function(dispatch) {
//     // First dispatch: the app state is updated to inform
//     // that the API call is starting.
//     // dispatch(requestChallenges(userid));
//     // The function called by the thunk middleware can return a value,
//     // that is passed on as the return value of the dispatch method.
//     // In this case, we return a promise to wait for.
//     // This is not required by thunk middleware, but it is convenient for us.
//     return fetch('http://thescalli.com/root/index.php/scheduleREST1/schedules')
//       .then(
//         response => response.json(),
//         // Do not use catch, because that will also catch
//         // any errors in the dispatch and resulting render,
//         // causing a loop of 'Unexpected batch number' errors.
//         // https://github.com/facebook/react/issues/6895
//         error => console.log('An error occurred.', error)
//       )
//       .then(json =>
//         // We can dispatch many times!
//         // Here, we update the app state with the results of the API call.
//         dispatch(receiveCards(json))
//       );
//   };
// }

// export function computeTopicMap({
//   cards,
//   width,
//   height,
//   longitude,
//   latitude,
//   zoom
// }) {
//   // Thunk middleware knows how to handle functions.
//   // It passes the dispatch method as an argument to the function,
//   // thus making it able to dispatch actions itself.
//   const vp = new PerspectiveMercatorViewport({
//     width,
//     height,
//     zoom,
//     latitude,
//     longitude
//   });
//
//   const cardsPos = cards.map(c => vp.project(c.loc));
//
//   return function(dispatch) {
//     return new Promise(resolve => {
//       d3.forceSimulation(cardsPos).on('end', () => {
//         dispatch(getTopicMap(cardsPos));
//       });
//     });
//
//     // .force('x', d3.forceX((d, i) => normPos[i].tx).strength(0.1))
//     // .force('y', d3.forceY((d, i) => normPos[i].ty).strength(0.1))
//     // .force(
//     //   'cont',
//     //   forceSurface()
//     //     .surfaces([
//     //       { from: { x: 0, y: 0 }, to: { x: 0, y: h } },
//     //       { from: { x: 0, y: h }, to: { x: w, y: h } },
//     //       { from: { x: w, y: h }, to: { x: w, y: 0 } },
//     //       { from: { x: w, y: 0 }, to: { x: 0, y: 0 } }
//     //     ])
//     //     .oneWay(true)
//     //     .elasticity(1)
//     //     .radius(r)
//     // )
//     // .force(
//     //   'collide',
//     //   d3.forceCollide(r).strength(1)
//     //   // .iterations(10)
//     // )
//     // return fetch('http://thescalli.com/root/index.php/scheduleREST1/schedules')
//     //   .then(
//     //     response => response.json(),
//     //     // Do not use catch, because that will also catch
//     //     // any errors in the dispatch and resulting render,
//     //     // causing a loop of 'Unexpected batch number' errors.
//     //     // https://github.com/facebook/react/issues/6895
//     //     error => console.log('An error occurred.', error)
//     //   )
//     //   .then(json =>
//     //     // We can dispatch many times!
//     //     // Here, we update the app state with the results of the API call.
//     //     dispatch(receiveCards(json))
//     //   );
//   };
// }

export function fetchNearByPlaces() {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.
  return function(dispatch) {
    const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
    // First dispatch: the app state is updated to inform
    // that the API call is starting.
    // dispatch(requestChallenges(userid));
    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.
    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    dispatch(receivePlaces(NearbyPlaces));
    return (
      fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=50.847109,4.352439&radius=500&key=${
          process.env.GoogleAccessToken
        }${PROXY_URL}`
      )
        // .then(
        //   response => console.log('nearbysearch', response),
        //   // Do not use catch, because that will also catch
        //   // any errors in the dispatch and resulting render,
        //   // causing a loop of 'Unexpected batch number' errors.
        //   // https://github.com/facebook/react/issues/6895
        //   error => console.log('An error occurred.', error)
        // )
        .then(json => {
          dispatch(receivePlaces(NearbyPlaces));
        })
    );
  };
}
