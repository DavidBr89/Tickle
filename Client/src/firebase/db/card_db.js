import {extractCardFields, TEMP_ID} from 'Constants/cardFields.ts';
import makeActivityFuncs from './activity_db';
import {addToStorage} from './index';

import {firestore, storageRef, Timestamp} from '../firebase';

const thumbFileName = fileName => `thumb_${fileName}`;

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
      // TODO: change later will break in future firebase release
      // TODO: change later
      .add({uid, text, timestamp: Timestamp.fromDate(new Date())});

  return {readComments, addComment};
};

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

  // TODO: error handling
  const uploadCardImg = (img, id) => {
    console.log('card Img Upload', img);
    if (img=== null || !img.file)
      return new Promise(resolve => resolve(img));

    const {file = null, ...restImgFields} = img;

    return addToStorage({
      file: img.file,
      path: `${ENV_STR}/cards/images/${id}`
    }).then(
      url => new Promise(resolve => resolve({...restImgFields, url}))
    );
  };

  const doUpdateCard = rawCard => {
    const card = extractCardFields(rawCard);
    console.log('card to Be', card);

    return uploadCardImg(card.img.value, card.id).then(imgSrc => {
      if (card.id === TEMP_ID) {
        throw Error('error: temp card to create');
      } else {
        const timestamp = null; // firestore.FieldValue.serverTimestamp();
        const newCard = {...card, img: {value: imgSrc}, timestamp};

        return TICKLE_ENV_REF.collection('cards')
          .doc(newCard.id)
          .set(newCard);
      }
    });
  };

  const readCards = ({authorId = null, playerId = null}) => {
    // TODO
    const thumbnailPromise = d => {
      console.log('readCards', d);
      // TODO
      if (true) return new Promise(resolve => resolve(d));

      const thumbNailRef = storageRef.child(
        `${ENV_STR}/images/cards/${thumbFileName(d.id)}`
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

  return {
    doUpdateCard,
    doDeleteCard,
    readCards,
    ...commentFuncs
  };
};

export default makeCardFuncs;