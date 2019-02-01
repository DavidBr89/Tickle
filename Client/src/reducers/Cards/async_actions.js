import uuidv1 from 'uuid/v1';

import CardDB from '~/firebase/db/card_db';
import {extractCardFields} from '~/constants/cardFields';
import TopicDB from '~/firebase/db/topic_db';
// import idGenerate from 'Src/idGenerator';
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
  receiveTopics,
  deleteTopic,
  putTopic
} from './actions';

import {selectCard, extendSelectedCard} from '../DataView/actions';

/**
 * fetches collectible cards for one user
 * @param {string} uid for user
 * @returns {string} user environment id
 */
export function fetchCollectibleCards({uid, userEnvId}) {
  return function(dispatch, getState) {
    const db = new CardDB(userEnvId);
    dispatch(loadingCards(true));
    // TODO: change later with obj params
    return db.readCards({playerId: uid}).then(
      data => {
        console.log('ZZZ userEnvId', userEnvId, 'uid', uid);
        dispatch(loadingCards(false));
        dispatch(receiveCollectibleCards(data.map(extractCardFields)));
      },
      err => console.log('fetch createdCards', err)
    );
  };
}

export function fetchAllCardsWithSubmissions(userEnvId) {
  return function(dispatch) {
    const db = new CardDB(userEnvId);
    dispatch(loadingCards(true));
    return db.readCards().then(data => {
      dispatch(loadingCards(false));
      dispatch(receiveCreatedCards(data.map(extractCardFields)));
    });
  };
}

export function fetchCreatedCards({userEnvId, uid}) {
  return function(dispatch) {
    dispatch(loadingCards(true));

    const db = new CardDB(userEnvId);
    return db.readCards({authorId: uid, playerId: null}).then(
      data => {
        dispatch(loadingCards(false));
        dispatch(receiveCreatedCards(data.map(extractCardFields)));
      },
      err => console.log('fetch createdCards', err)
    );
  };
}

export function asyncCreateCard({cardData, userEnvId}) {
  return function(dispatch) {
    const db = new CardDB(userEnvId);

    const newCard = {
      ...cardData,
      id: uuidv1(),
      date: new Date()
    };
    dispatch(createCard(newCard));
    dispatch(extendSelectedCard(null));
    dispatch(selectCard(newCard.id));

    return db
      .doUpdateCard(newCard)
      .then(() => dispatch(createCardSuccess(newCard)));
  };
}
//
export function asyncRemoveCard({cardId, userEnvId}) {
  return function(dispatch) {
    const db = new CardDB(userEnvId); // createDbEnv(getState());
    dispatch(deleteCard(cardId));
    dispatch(selectCard(null));
    return db.doDeleteCard(cardId).then(() => {
      dispatch(deleteCardSuccess(cardId));
    });
  };
}

export function asyncUpdateCard({cardData, userEnvId}) {
  return dispatch => {
    dispatch(updateCard(cardData));
    const db = new CardDB(userEnvId);
    return db
      .doUpdateCard(cardData)
      .then(() => dispatch(updateCardSuccess(cardData)))
      .catch(err => dispatch(updateCardError(err)));
  };
}

// export function asyncAddComment(
//   commentObj = {
//     authorId: null,
//     cardId: null,
//     comment: {uid: '', text: '', date: null},
//   },
//   userEnvId,
// ) {
//   return function(dispatch, getState) {
//     const db = CardDB(userEnvId);
//     dispatch(addComment(commentObj));
//     return db
//       .addComment(commentObj)
//       .then(() => {
//         dispatch(addCommentSuccess());
//       })
//       .catch(err => dispatch(addCommentError(err)));
//   };
// }

export function asyncSubmitActivity({
  userEnvId,
  ...activitySubmission
}) {
  return function(dispatch) {
    const db = CardDB(userEnvId);

    dispatch(submitActivity(activitySubmission));
    return db
      .addActivitySubmission(activitySubmission)
      .then(() => dispatch(submitActivitySuccess()))
      .catch(err => {
        throw new Error('error saving challenge submission');
      });
  };
}

export function removeChallengeSubmission({
  challengeSubmission,
  userEnvId
}) {
  const {cardId, playerId} = challengeSubmission;

  return function(dispatch, getState) {
    const db = CardDB(userEnvId); // createDbEnv(getState());
    // dispatch(submitActivity(challengeSubmission));
    return db.removeActivitySubmission({cardId, playerId});
    //   .then(() => dispatch(submitActivitySuccess()))
    //   .catch(err => {
    //     throw new Error('error saving challenge submission');
    //   });
  };
}

export function updateTopic(topic, userEnv) {
  return function(dispatch) {
    const {doCreateTopic} = TopicDB(userEnv);

    return doCreateTopic(topic)
      .then(() => {
        dispatch(putTopic(topic));
      })
      .catch(err => console.log('err', err));
  };
}

export function removeTopic(topicId, userEnv) {
  console.log('remove topic', topicId, userEnv);
  return function(dispatch) {
    const {doDeleteTopic} = TopicDB(userEnv);

    return doDeleteTopic(topicId)
      .then(() => {
        dispatch(deleteTopic(topicId));
      })
      .catch(err => console.log('err', err));
  };
}

export function fetchTopics(userEnv) {
  return function(dispatch) {
    const {doReadTopics, doAddTopic} = TopicDB(userEnv);

    return doReadTopics()
      .then(topics => {
        dispatch(receiveTopics(topics));
      })
      .catch(err => console.log('err', err));
  };
}
