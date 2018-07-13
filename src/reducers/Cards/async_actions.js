import generate from 'firebase-auto-ids';

import fetch from 'cross-fetch';
import { updCard } from './helper';

import {
  receivePlaces,
  receiveReadableCards,
  receiveCreatedCards,
  receiveCardTemplates,
  createCard,
  createCardSuccess,
  deleteCard,
  deleteCardSuccess,
  deleteCardError,
  loadingCards,
  updateCard,
  updateCardSuccess,
  updateCardError,
  addComment,
  addCommentSuccess,
  addCommentError,
  submitChallenge,
  submitChallengeSuccess
} from './actions';

import { selectCard, extendSelectedCard } from '../DataView/actions';

import NearbyPlaces from '../places.json';

import { db, firebase } from 'Firebase';
import idGenerate from 'Src/idGenerator';

import gapi from './gapi';

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
    return db.readCards(uid, 'createdCards').then(data => {
      dispatch(receiveReadableCards(data));
    });
  };
}

export function fetchCreatedCards(uid) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.
  return function(dispatch) {
    dispatch(loadingCards());

    return db.readCards(uid, 'createdCards').then(data => {
      dispatch(receiveCreatedCards(data));
    });
  };
}

export function fetchCardTemplates(uid) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.
  return function(dispatch) {
    dispatch(loadingCards());
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

export function asyncCreateCard({ cardData, uid, viewport, dataView }) {
  console.log('asyncCreateCard', { cardData, uid, viewport, dataView });
  // const { floorX, floorY, img, loc, media, title, tags, challenge } = cardData;

  const newCard = {
    ...cardData,
    id: idGenerate(),
    uid,
    // TODO: does not transmit correctly
    date: new Date()
  };

  return function(dispatch) {
    dispatch(createCard(newCard));
    dispatch(extendSelectedCard(null));
    dispatch(selectCard(newCard.id));

    return db
      .doCreateCard(uid, newCard)
      .then(() => dispatch(createCardSuccess(newCard)));
  };
}

export function asyncRemoveCard(cid) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function, thus making it able to dispatch actions itself.
  console.log('async remove card', cid);
  return function(dispatch) {
    dispatch(deleteCard(cid));
    dispatch(selectCard(null));
    // TODO: remove dependencies
    return db.doDeleteCard(cid).then(querySnapshot => {
      dispatch(deleteCardSuccess(cid));
    });
  };
}

export function asyncUpdateCard({ uid, cardData, viewport, dataView }) {
  const updatedCard = updCard({ rawData: cardData, viewport, dataView });
  return function(dispatch) {
    dispatch(updateCard(updatedCard));
    return db
      .doUpdateCard(uid, updatedCard)
      .then(() => {
        dispatch(updateCardSuccess(updatedCard));
      })
      .catch(err => dispatch(updateCardError(err)));
  };
}

export function asyncAddComment(
  commentObj = {
    authorId: null,
    cardId: null,
    comment: { uid: '', text: '', date: null }
  }
) {
  return function(dispatch) {
    dispatch(addComment(commentObj));
    return db
      .addComment(commentObj)
      .then(() => {
        dispatch(addCommentSuccess());
      })
      .catch(err => dispatch(addCommentError(err)));
  };
}

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

export function asyncSubmitChallenge(challengeSubmission) {
  return function(dispatch) {
    console.log('response', db, challengeSubmission);
    const {
      authorId: uid,
      cardId,
      playerId,
      ...challengeData
    } = challengeSubmission;
    dispatch(submitChallenge(challengeSubmission));
    return db
      .addChallengeSubmission({ uid, cardId, playerId, challengeData })
      .then(() => dispatch(submitChallengeSuccess()))
      .catch(err => {
        throw new Error('error saving challenge submission');
      });

    // return fetch(
    //   `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=50.847109,4.352439&radius=500&key=${
    //     process.env.GoogleAccessToken
    //   }${PROXY_URL}`
    // ).then(json => {
    //   dispatch(receivePlaces(NearbyPlaces));
    // });
  };
}
