import fetch from 'cross-fetch';
import {uniqBy, flatten} from 'lodash';

import CardDB from 'Firebase/db';
// import {auth} from 'Firebase';
import uuidv1 from 'uuid/v1';

import {
  readAllUserEnvs,
  createUserEnv,
  addUserToEnv,
  readUserIdsFromEnv,
  readAllUsers,
  readAllTmpUsers,
  createTmpUser,
  getOneUserByEmail,
  getOneUserFromEnv,
  getUserEnvs,
} from 'Firebase/db';

import {
  receiveUsers,
  receiveAllUserEnvs,
  getCards,
  submitActivityReview,
  submitActivityReviewSuccess,
  receiveCards,
  selectUsersByEnv,
  insertUserIntoEnv,
  addUserEnv,
  addUser,
  userRegistrationError,
} from './actions';

import NearbyPlaces from '../places.json';

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
export function fetchAllUserEnvs() {
  return function(dispatch) {
    return readAllUserEnvs().then(userEnvs => {
      dispatch(receiveAllUserEnvs(userEnvs));
    });
  };
}

export function createNewUserEnv(env) {
  // const db = CardDB();
  return function(dispatch) {
    return createUserEnv(env).then(() => {
      dispatch(addUserEnv(env));
    });
  };
}

export function registerUserToEnv({userEnvId, uid}) {
  return function(dispatch) {
    return addUserToEnv({uid, userEnvId}).then(users => {
      dispatch(insertUserIntoEnv(uid));
    });
  };
}

// export function fetchUserIdsFromEnv(userEnv) {
//   return function(dispatch) {
//     const usersWithEnvIdsPromise = readAllUsers().then(users =>
//       users.map(u =>
//         getUserEnvs(u.uid).then(userEnvs => ({
//           ...u,
//           userEnvIds: userEnvs.map(e => e.id),
//         })),
//       ),
//     );
//     return Promise.all([usersWithEnvIdsPromise, readAllTmpUsers()]).then(
//       ([userWithEnvIds, tmpUsers]) => [...userWithEnvIds, ...tmpUsers],
//     );
//     // return readUserIdsFromEnv(userEnv).then(users => {
//     //   readAllTmpUsers().then(users => {
//     //     const tmpUsers = users.filter(u => u.userEnvId === userEnv);
//     //     dispatch(selectUsersByEnv([...users.map(u => u.uid), ...tmpUsers]));
//     //   });
//     // });
//   };
// }

export function fetchUsers() {
  return function(dispatch) {
    const usersWithEnvIdsPromise = readAllUsers().then(users =>
      Promise.all(
        users.map(u =>
          getUserEnvs(u.uid).then(userEnvs => ({
            ...u,
            userEnvIds: userEnvs.map(e => e.id),
          })),
        ),
      ),
    );

    const promises = [usersWithEnvIdsPromise, readAllTmpUsers()];
    Promise.all(promises).then(([users, tmpUsers]) => {
      dispatch(receiveUsers([...users, ...tmpUsers]));
    });
  };
}

export function preRegisterUser(usrInfo) {
  const usr = {...usrInfo, uid: uuidv1(), tmp: true};
  return function(dispatch) {
    getOneUserByEmail(usr.email).then(d => {
      if (d === null) {
        // TODO add uid
        createTmpUser(usr).then(() => {
          dispatch(addUser({...usr}));
        });
      } else {
        dispatch(
          userRegistrationError({
            code: 'User Registration',
            msg: 'User has been already registered',
          }),
        );
      }
    });
  };
}

// export function fetchCards({userEnvId, authorId = null, playerId = null}) {
//   const db = CardDB(userEnvId);
//
//   return function(dispatch) {
//     return db.readCards({authorId, playerId: null}).then(cards => {
//       // console.log('USers', data);
//       // const promises = data.map(({ uid }) => db.getDetailedUserInfo(uid));
//       dispatch(receiveCards(cards));
//       // Promise.all(promises).then(detailedUsers => {
//       //   dispatch(receiveUsers(detailedUsers));
//       //   dispatch(
//       //     getCards(
//       //       uniqBy(flatten(detailedUsers.map(u => u.createdCards)), 'id')
//       //     )
//       //   );
//       // });
//     });
//   };
// }
// export function asyncSubmitChallengeReview(challengeSubmission) {
//   const {cardId, playerId, ...challengeData} = challengeSubmission;
//   console.log('challengeSubmission', {cardId, playerId, ...challengeData});
//   return function(dispatch) {
//     dispatch(submitActivityReview(challengeSubmission));
//     console.log('submit challenge review', {cardId, playerId, challengeData});
//     return db
//       .addChallengeSubmission({cardId, playerId, challengeData})
//       .then(() => dispatch(submitActivityReviewSuccess()));
//     // .catch(err => {
//     //   throw new Error(`error saving challenge submission ${err}`);
//     // });
//   };
// }

// export function fetchAllCardsWithSubmissions() {
//   return function(dispatch) {
//     // dispatch(loadingCards(true));
//     return db.readAllCards().then(cards => {
//       // dispatch(loadingCards(false));
//       dispatch(getCards(cards));
//       db.onceGetUsers().then(users => {
//         const usersWithSubmissions = users.map(u => {
//           const createdCards = cards
//             .filter(c => c.uid === u.uid)
//             .map(d => d.id);
//           const challengeSubmissions = cards.filter(c =>
//             c.allChallengeSubmissions.find(s => s.playerId === u.uid),
//           );
//           return {...u, challengeSubmissions, , userEnvIdcreatedCards};
//         });
//         dispatch(receiveUsers(usersWithSubmissions));
//         // dispatch(receiveUsers(newUsers));
//       });
//     });
//   };
// }
