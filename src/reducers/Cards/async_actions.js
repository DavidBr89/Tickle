// import generate from 'firebase-auto-ids';

import fetch from 'cross-fetch';

import {extractCardFields} from 'Constants/cardFields.ts';

import {createDbEnv, DB} from 'Firebase';
import idGenerate from 'Src/idGenerator';
import {
  receivePlaces,
  receiveCollectibleCards,
  receiveCreatedCards,
  // receiveCardTemplates,
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
  submitActivity,
  submitActivitySuccess,
} from './actions';

import {selectCard, extendSelectedCard} from '../DataView/actions';

import NearbyPlaces from '../places.json';

export function fetchCollectibleCards({uid, userEnv}) {
  return function(dispatch) {
    const db = new DB(userEnv);
    dispatch(loadingCards(true));
    // TODO: change later with obj params
    return db.readCards({playerId: uid}).then(
      data => {
        dispatch(loadingCards(false));
        dispatch(receiveCollectibleCards(data.map(extractCardFields)));
      },
      err => console.log('fetch createdCards', err),
    );
  };
}

export function fetchAllCardsWithSubmissions({userEnv}) {
  return function(dispatch, getState) {
    const db = new DB(userEnv);
    dispatch(loadingCards(true));
    return db.readCards().then(data => {
      dispatch(loadingCards(false));
      dispatch(receiveCreatedCards(data.map(extractCardFields)));
    });
  };
}

export function fetchCreatedCards({userEnv, uid}) {
  return function(dispatch) {
    dispatch(loadingCards(true));

    const db = new DB(userEnv);
    return db.readCards({authorId: uid, playerId: null}).then(
      data => {
        dispatch(loadingCards(false));
        dispatch(receiveCreatedCards(data.map(extractCardFields)));
      },
      err => console.log('fetch createdCards', err),
    );
  };
}

export function asyncCreateCard({cardData, userEnv}) {
  return function(dispatch, getState) {
    const db = new DB(userEnv);

    const newCard = {
      ...cardData,
      id: idGenerate(),
      date: new Date(),
    };
    dispatch(createCard(newCard));
    dispatch(extendSelectedCard(null));
    dispatch(selectCard(newCard.id));

    return db
      .doCreateCard(newCard)
      .then(() => dispatch(createCardSuccess(newCard)));
  };
}

export function asyncRemoveCard({cardId, userEnv}) {
  return function(dispatch) {
    const db = new DB(userEnv); // createDbEnv(getState());
    dispatch(deleteCard(cardId));
    dispatch(selectCard(null));
    return db.doDeleteCard(cardId).then(() => {
      dispatch(deleteCardSuccess(cardId));
    });
  };
}

export function asyncUpdateCard({cardData, userEnv}) {
  return (dispatch, getState) => {
    dispatch(updateCard(cardData));
    const db = new DB(userEnv); // createDbEnv(getState());
    db.doUpdateCard(cardData)
      .then(() => {
        dispatch(updateCardSuccess(cardData));
      })
      .catch(err => dispatch(updateCardError(err)));
  };
}

export function asyncAddComment(
  commentObj = {
    authorId: null,
    cardId: null,
    comment: {uid: '', text: '', date: null},
  },
  userEnv,
) {
  return function(dispatch, getState) {
    const db = DB(userEnv);
    dispatch(addComment(commentObj));
    return db
      .addComment(commentObj)
      .then(() => {
        dispatch(addCommentSuccess());
      })
      .catch(err => dispatch(addCommentError(err)));
  };
}

export function asyncSubmitActivity({userEnv, ...activitySubmission}) {
  return function(dispatch) {
    const db = DB(userEnv);

    dispatch(submitActivity(activitySubmission));
    return db
      .addActivitySubmission(activitySubmission)
      .then(() => dispatch(submitActivitySuccess()))
      .catch(err => {
        throw new Error('error saving challenge submission');
      });
  };
}

export function removeChallengeSubmission({challengeSubmission, userEnv}) {
  const {cardId, playerId} = challengeSubmission;

  return function(dispatch, getState) {
    const db = DB(userEnv); // createDbEnv(getState());
    // dispatch(submitActivity(challengeSubmission));
    return db.removeActivitySubmission({cardId, playerId});
    //   .then(() => dispatch(submitActivitySuccess()))
    //   .catch(err => {
    //     throw new Error('error saving challenge submission');
    //   });
  };
}
