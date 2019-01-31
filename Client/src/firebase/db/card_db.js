import {extractCardFields} from '~/constants/cardFields.ts';
import makeActivityFuncs from './activity_db';
import {addToStorage, removeFromStorage} from './index';

import {firestore, storageRef, Timestamp} from '../firebase';

const thumbFileName = fileName => `thumb_${fileName}`;

/**
 * Comment DB functions
 */
const makeCommentFuncs = TICKLE_ENV_REF => {
  const getBasicUser = uid =>
    firestore
      .collection('users')
      .doc(uid)
      .get()
      .then(doc => new Promise(resolve => resolve(doc.data())));

  const readComments = cardId =>
    TICKLE_ENV_REF.collection('cards')
      .doc(cardId)
      .collection('comments')
      .get()
      .then(querySnapshot => {
        const commentPromises = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          const {uid} = data;
          commentPromises.push(
            getBasicUser(uid).then(usr => ({
              ...usr,
              ...data,
              date: data.timestamp.toDate()
            }))
          );
        });

        return Promise.all(commentPromises);
      });

  const addComment = ({uid, cardId, text}) =>
    TICKLE_ENV_REF.collection('cards')
      .doc(cardId)
      .collection('comments')
      .add({uid, text, timestamp: Timestamp.fromDate(new Date())});

  return {readComments, addComment};
};

/**
 * Card db functions
 * @param {string} environment id
 * @returns {object} to access cards in db
 */
const makeCardFuncs = ENV_STR => {
  const TICKLE_ENV_REF = firestore
    .collection('card-environments')
    .doc(ENV_STR);

  const activityDB = makeActivityFuncs(ENV_STR);
  const commentFuncs = makeCommentFuncs(TICKLE_ENV_REF);

  const doDeleteCard = cid =>
    TICKLE_ENV_REF.collection('cards')
      .doc(cid)
      .delete();

  const doUpdateCard = rawCard => {
    const card = extractCardFields(rawCard);

    return TICKLE_ENV_REF.collection('cards')
      .doc(card.id)
      .set(card);
  };

  const readCards = ({authorId = null, playerId = null}) => {
    const thumbnailPromise = d => {
      const thumbNailRef = storageRef.child(
        `img/${thumbFileName(d.id)}`
      );

      return thumbNailRef.getDownloadURL().then(
        url => ({...d, img: {...d.img, thumbnail: url}}),
        err => {
          const img = {...d.img, thumbnail: null};
          console.log('No thumbnail error', err);
          return {...d, img};
        }
      );
    };

    const activityPromise = c => {
      if (playerId) {
        return activityDB
          .getOneActivitySub({cardId: c.id, playerId})
          .then(activitySubmission => ({...c, activitySubmission}));
      }
      return activityDB
        .getAllActivitySubs(c.id)
        .then(allChallengeSubmissions => ({
          ...c,
          allChallengeSubmissions
        }));
    };

    const refCards =
      authorId === null
        ? TICKLE_ENV_REF.collection('cards')
        : TICKLE_ENV_REF.collection('cards').where(
          'uid',
          '==',
          authorId
        );

    return refCards
      .get()
      .then(querySnapshot => {
        const tmpData = [];
        querySnapshot.forEach(doc => {
          tmpData.push(doc.data());
        });
        return tmpData;
      })
      .then(data =>
        Promise.all(
          data.map(e => thumbnailPromise(e).then(activityPromise))
        )
      );
  };

  const addFileToEnv = ({file, path}) =>
    addToStorage({file, path: `${ENV_STR}/${path}`});

  const removeFileFromEnv = path =>
    removeFromStorage(`${ENV_STR}/${path}`);

  return {
    doUpdateCard,
    doDeleteCard,
    addFileToEnv,
    removeFileFromEnv,
    readCards,
    ...commentFuncs
  };
};

export default makeCardFuncs;
