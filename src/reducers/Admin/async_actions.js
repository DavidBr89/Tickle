import fetch from 'cross-fetch';
import { uniqBy, flatten } from 'lodash';

import { receiveUsers, getCards } from './actions';

import NearbyPlaces from '../places.json';

import { db, firebase } from 'Firebase';
import idGenerate from 'Src/idGenerator';

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
export function fetchUsers() {
  return function(dispatch) {
    return db.onceGetUsers().then(users => {
      // console.log('USers', data);
      // const promises = data.map(({ uid }) => db.getDetailedUserInfo(uid));
      dispatch(receiveUsers(users));
      // Promise.all(promises).then(detailedUsers => {
      //   dispatch(receiveUsers(detailedUsers));
      //   dispatch(
      //     getCards(
      //       uniqBy(flatten(detailedUsers.map(u => u.createdCards)), 'id')
      //     )
      //   );
      // });
    });
  };
}

export function fetchCreatedCards(uid) {
  console.log('uid', uid);
  return function(dispatch) {
    return db.readCards(uid, 'createdCards').then(cards => {
      // console.log('USers', data);
      // const promises = data.map(({ uid }) => db.getDetailedUserInfo(uid));
      dispatch(getCards(cards));
      // Promise.all(promises).then(detailedUsers => {
      //   dispatch(receiveUsers(detailedUsers));
      //   dispatch(
      //     getCards(
      //       uniqBy(flatten(detailedUsers.map(u => u.createdCards)), 'id')
      //     )
      //   );
      // });
    });
  };
}
