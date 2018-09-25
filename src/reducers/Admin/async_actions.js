import fetch from 'cross-fetch';
import { uniqBy, flatten } from 'lodash';

import {
  receiveUsers,
  getCards,
  submitChallengeReview,
  submitChallengeReviewSuccess
} from './actions';

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

export function asyncSubmitChallengeReview(challengeSubmission) {
  console.log('challengeSubmission', challengeSubmission);
  const { cardId, playerId, ...challengeData } = challengeSubmission;
  return function(dispatch) {
    dispatch(submitChallengeReview(challengeSubmission));
    console.log('submit challenge', { cardId, playerId, challengeData });
    return db
      .addChallengeSubmission({ cardId, playerId, challengeData })
      .then(() => dispatch(submitChallengeReviewSuccess()));
    // .catch(err => {
    //   throw new Error(`error saving challenge submission ${err}`);
    // });
  };
}

export function fetchAllCardsWithSubmissions() {
  return function(dispatch) {
    // dispatch(loadingCards(true));
    return db.readCardsWithSubmissions().then(cards => {
      // dispatch(loadingCards(false));
      dispatch(getCards(cards));
      db.onceGetUsers().then(users => {
        const usersWithSubmissions = users.map(u => {
          const createdCards = cards
            .filter(c => c.uid === u.uid)
            .map(d => d.id);
          const challengeSubmissions = cards.filter(c =>
            c.allChallengeSubmissions.find(s => s.playerId === u.uid)
          );
          return { ...u, challengeSubmissions, createdCards };
        });
        dispatch(receiveUsers(usersWithSubmissions));
        // dispatch(receiveUsers(newUsers));
      });
    });
  };
}
