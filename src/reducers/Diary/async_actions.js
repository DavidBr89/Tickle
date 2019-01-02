import fetch from 'cross-fetch';
import { uniqBy, flatten } from 'lodash';

import { receiveUserInfo } from './actions';

import NearbyPlaces from '../places.json';

import { db, firebase } from 'Firebase';
import {getDetailedUserInfo} from 'Firebase/db';
import setify from 'Utils/setify';

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
export function getUserInfo(uid) {
  return function(dispatch) {
    return getDetailedUserInfo(uid).then(info => {
      const {
        interests: plainInterests,
        createdCards,
        collectedCards,
        ...userDetails
      } = info;

      const interests = plainInterests.map(key => ({
        key,
        count: 10,
        values: []
      }));

      const cardSets = setify([...createdCards, ...collectedCards]);

      const numCollectedCards = collectedCards.length;
      const numCreatedCards = createdCards.length;

      const detailInfo = {
        ...userDetails,
        interests,
        cardSets,
        skills: cardSets,
        collectedCards,
        createdCards,
        numCollectedCards,
        numCreatedCards
      };

      dispatch(receiveUserInfo(detailInfo));
    });
  };
}

// export function fetchCreatedCards(uid) {
//   console.log('uid', uid);
//   return function(dispatch) {
//     // db.getCardsWithSubmissions(uid);
//     return db.readCardsWithSubmissions(uid).then(cards => {
//       console.log('cards', cards);
//       dispatch(getCards(cards));
//     });
//   };
// }
