import fetch from 'cross-fetch';
import * as d3 from 'd3';

import { receiveCards} from './components/CardCreator/actions';

import {
  // WebMercatorViewport,
  PerspectiveMercatorViewport
} from 'viewport-mercator-project';

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

// Meet our first thunk action creator!
// Though its insides are different, you would use it just like any other action creator:
// store.dispatch(fetchPosts('reactjs'))
export function fetchChallenges(userid) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.
  return function(dispatch) {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.
    // dispatch(requestChallenges(userid));
    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.
    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.
    return fetch('http://thescalli.com/root/index.php/scheduleREST1/schedules')
      .then(
        response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing a loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => console.log('An error occurred.', error)
      )
      .then(json =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.
        dispatch(receiveCards(json))
      );
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

export function computeTopicMap({
  cards,
  width,
  height,
  longitude,
  latitude,
  zoom
}) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.
  const vp = new PerspectiveMercatorViewport({
    width,
    height,
    zoom,
    latitude,
    longitude
  });

  const cardsPos = cards.map(c => vp.project(c.loc));

  return function(dispatch) {
    return new Promise(resolve => {
      d3.forceSimulation(cardsPos).on('end', () => {
        dispatch(getTopicMap(cardsPos));
      });
    });

    // .force('x', d3.forceX((d, i) => normPos[i].tx).strength(0.1))
    // .force('y', d3.forceY((d, i) => normPos[i].ty).strength(0.1))
    // .force(
    //   'cont',
    //   forceSurface()
    //     .surfaces([
    //       { from: { x: 0, y: 0 }, to: { x: 0, y: h } },
    //       { from: { x: 0, y: h }, to: { x: w, y: h } },
    //       { from: { x: w, y: h }, to: { x: w, y: 0 } },
    //       { from: { x: w, y: 0 }, to: { x: 0, y: 0 } }
    //     ])
    //     .oneWay(true)
    //     .elasticity(1)
    //     .radius(r)
    // )
    // .force(
    //   'collide',
    //   d3.forceCollide(r).strength(1)
    //   // .iterations(10)
    // )
    // return fetch('http://thescalli.com/root/index.php/scheduleREST1/schedules')
    //   .then(
    //     response => response.json(),
    //     // Do not use catch, because that will also catch
    //     // any errors in the dispatch and resulting render,
    //     // causing a loop of 'Unexpected batch number' errors.
    //     // https://github.com/facebook/react/issues/6895
    //     error => console.log('An error occurred.', error)
    //   )
    //   .then(json =>
    //     // We can dispatch many times!
    //     // Here, we update the app state with the results of the API call.
    //     dispatch(receiveCards(json))
    //   );
  };
}
