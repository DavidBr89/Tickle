import firebase from '@firebase/app';

import { extractCardFields } from 'Constants/cardFields';

import { firestore, Timestamp, storageRef } from '../firebase';


const CARD_ENVS = 'card-environments';

const isDefined = a => a !== null && a !== undefined;

const pruneFields = (fields) => {
  const isNotFileOrFunc = val => !(val instanceof File) && !(val instanceof Function);

  const pruneObject = obj => Object.keys(obj).reduce((acc, attr) => {
    const val = obj[attr];
    if (isNotFileOrFunc(val)) acc[attr] = val;
    return acc;
  }, {});

  return Object.keys(fields).reduce((acc, attr) => {
    const val = fields[attr];
    if (val instanceof Array) {
      acc[attr] = val;
      return acc;
    }
    if (val instanceof Object) {
      acc[attr] = pruneObject(val);
      return acc;
    }
    if (isNotFileOrFunc(val)) acc[attr] = val;
    return acc;
  }, {});
};

const thumbFileName = fileName => `thumb_${fileName}`;

export const readCopyUsers = () => {
  console.log('readCopyUsers');
  firestore
    .collection('staging_vds_geo_cards')
    .get()
    .then((querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        const d = doc.data();
        data.push(d);
      });

      data.forEach(d => firestore
        .collection(CARD_ENVS)
        .doc('staging')
        .collection('cards')
        .doc(d.id)
        .set(d), );
    });
};

// const haaike = 'PpNOHOQLtXatZzcaAYVCMQQP5XT2';

const removeFromStorage = (path) => {
  const imgRef = storageRef.child(path);
  return imgRef.delete().catch((error) => {
    console.log('error', error);
    throw new Error(`error in deleting file${path} ${error}`);
  });
};

const addFileToFirebaseStorage = ({ file, path, id }) => {
  const metadata = { contentType: file.type };
  const imgRef = storageRef.child(`${path}/${id}`);
  return imgRef
    .put(file, metadata)
    .then(() => new Promise(resolve => resolve(imgRef.getDownloadURL())))
    .catch((err) => {
      console.log('err', err);
      throw new Error(`error in uploading img for ${file.name}`);
      // Handle any error that occurred in any of the previous
      // promises in the chain.
    });
};

const makeCardFuncs = ({
  TICKLE_ENV_REF,
  ENV_STR,
  getOneChallengeSubmission,
  getAllChallengeSubmissions
}) => {
  const doDeleteCard = cid => TICKLE_ENV_REF.collection('cards')
    .doc(cid)
    .delete();

  // TODO: error handling
  const uploadImgFields = (card) => {
    if (card.img === null) return new Promise(resolve => resolve(null));

    const { file = null, ...restImgFields } = card.img;

    return file
      ? addFileToFirebaseStorage({
        file,
        path: `${ENV_STR}/cards/images`,
        id: card.id
      }).then((url) => {
        const img = {
          ...restImgFields,
          url
        };
        return new Promise(resolve => resolve(img));
      })
      : new Promise(resolve => resolve({ ...restImgFields }));
  };

  const doCreateCard = card => uploadImgFields(card).then((img) => {
    if (card.id === 'temp') {
      throw Error('error: temp card to create');
    } else {
      const timestamp = null; // firestore.FieldValue.serverTimestamp();
      const newCard = extractCardFields({ ...card, img, timestamp });
      console.log('newCard UPD', newCard);

      return TICKLE_ENV_REF.collection('cards')
        .doc(newCard.id)
        .set(newCard);
    }
  });

  const readCards = ({ authorId = null, playerId = null }) => {
    const thumbnailPromise = (d) => {
      if (!d.img) return new Promise(resolve => resolve(d));

      const thumbNailRef = storageRef.child(
        `${ENV_STR}/images/cards/${thumbFileName(d.id)}`,
      );

      return thumbNailRef.getDownloadURL().then(
        url => ({ ...d, img: { ...d.img, thumbnail: url } }),
        (err) => {
          const img = { ...d.img, thumbnail: null };
          console.log('No thumbnail error', err);
          return { ...d, img };
        },
      );
    };

    const challengePromise = (c) => {
      if (playerId) {
        return getOneChallengeSubmission({ cardId: c.id, playerId }).then(
          challengeSubmission => ({ ...c, challengeSubmission }),
        );
      }
      return getAllChallengeSubmissions(c.id).then(allChallengeSubmissions => ({
        ...c,
        allChallengeSubmissions
      }));
    };

    const refCards = !authorId
      ? TICKLE_ENV_REF.collection('cards')
      : TICKLE_ENV_REF.collection('cards').where('uid', '==', authorId);

    return refCards
      .get()
      .then((querySnapshot) => {
        const tmpData = [];
        querySnapshot.forEach((doc) => {
          tmpData.push(doc.data());
        });
        return tmpData;
      })
      .then(data => Promise.all(data.map(e => thumbnailPromise(e).then(challengePromise))));
  };

  return {
    doCreateCard, doUpdateCard: doCreateCard, doDeleteCard, readCards
  };
};

const makeCommentFuncs = ({ TICKLE_ENV_REF }) => {
  const readComments = cardId => TICKLE_ENV_REF.collection('cards')
    .doc(cardId)
    .collection('comments')
    .get()
    .then((querySnapshot) => {
      const comments = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        comments.push({ ...data, date: data.timestamp.toDate() });
      });
      return new Promise(
        resolve => resolve(comments),
        error => console.log('error in readComments', error),
      );
    });

  const addComment = ({ uid, cardId, text }) => TICKLE_ENV_REF.collection('cards')
    .doc(cardId)
    .collection('comments')
  // TODO: change later will break in future firebase release
  // TODO: change later
    .add({ uid, text, timestamp: Timestamp.fromDate(new Date()) });

  return { readComments, addComment };
};

const makeUserFuncs = ({ ENV_STR, readCards }) => {
  const onceGetUsers = () => firestore.collection('users')
    .get()
    .then((querySnapshot) => {
      const data = [];
      querySnapshot.forEach(doc => data.push(doc.data()));

      const dataPromises = data.map((d) => {
        const thumbNailRef = storageRef.child(
          `/images/usr/${thumbFileName(d.uid)}`,
        );
          // return d;
        return thumbNailRef.getDownloadURL().then(
          url => ({ ...d, thumbnail: url }),
          (err) => {
            // TODO: check later
            const img = { ...d, thumbnail: null };
            return { ...d, ...img };
          },
        );
      });

      return Promise.all(dataPromises)
        .catch(error => console.log('error in reading users', error));
    });


  const getUser = uid => firestore.collection('users')
    .doc(uid)
    .get()
    .then(doc => new Promise(resolve => resolve(doc.data())))
    .then((usr) => {
      console.log('USR RESULT', usr);
      if (!usr) {
        return Promise.reject({
          code: 'User has no access to this environment',
          message: 'User has no access to this environment'
        });
      }

      return getUserEnvs(uid).then(userEnvs => ({ ...usr, userEnvs }));
    });
  // .catch(err => console.log('err  getUser', err));

  const getDetailedUserInfo = uid => getUser(uid)
    .then(usr => readCards({ authorId: uid }).then(createdCards => ({
      ...usr,
      createdCards,
      collectedCards: []
    })))
    .catch(err => console.log('err i getUser', err));

  const getUserEnvs = uid => firestore.collection('users')
    .doc(uid)
    .collection('userEnvs')
    .get()
    .then((querySnapshot) => {
      const data = [];
      querySnapshot.forEach(doc => data.push(doc.data()));

      return new Promise(
        resolve => resolve(data),
        error => console.log('error in getUser, doc not existing', error),
      );
    })
    .catch(err => console.log('err  getUser'));

  const addUserEnv = ({ uid, env }) => firestore.collection('users')
    .doc(uid)
    .collection('userEnvs')
    .doc(env.id)
    .set(env)
    .then(() => env)
    .catch(err => console.log('addUserEnv err', err));

  const removeUserEnv = ({ uid, envId }) => firestore.collection('users')
    .doc(uid)
    .collection('userEnvs')
    .doc(envId)
    .delete()
    .catch(err => console.log('addUserEnv err', err));

  const doCreateUser = userProfile => firestore.collection('users')
    .doc(userProfile.uid)
    .set(userProfile)
    .then(() => addUserEnv({ uid: userProfile.uid, env: { id: ENV_STR } })
      .then(env => ({
        ...userProfile, userEnvs: [env]
      })));
  // TODO: catch and remove user when registration fails

  return {
    getDetailedUserInfo,
    getUser,
    doCreateUser,
    doUpdateUser: doCreateUser,
    onceGetUsers,
    addUserEnv,
    removeUserEnv
  };
};

const makeChallengFuncs = ({ TICKLE_ENV_REF }) => {
  const getAllChallengeSubmissions = (cid) => {
    const chSub = TICKLE_ENV_REF.collection('cards')
      .doc(cid)
      .collection('challengeSubmissions');

    const challengeSubmissions = [];
    return chSub.get().then((snapshot) => {
      snapshot.forEach((item) => {
        const d = item.data(); // will have 'todo_item.title' and 'todo_item.completed'
        // console.log('challengeSub', item);
        challengeSubmissions.push({ ...d, cardId: cid, playerId: item.id });
      });
      return new Promise(resolve => resolve(challengeSubmissions));
    });
  };

  const getOneChallengeSubmission = ({ cardId, playerId }) => TICKLE_ENV_REF.collection('cards')
    .doc(cardId)
    .collection('challengeSubmissions')
    .doc(playerId)
    .get()
    .then(doc => new Promise(resolve => resolve(doc.data() || null)));

  const addChallengeSubmission = ({ cardId, playerId, challengeData }) => TICKLE_ENV_REF.collection('cards')
    .doc(cardId)
    .collection('challengeSubmissions')
    .doc(playerId)
    .set({
      ...challengeData, date: new Date(), playerId, cardId
    })
    .catch((err) => {
      throw new Error(
        `error adding challengesubmission for ${playerId} ${err}`,
      );
      // Handle any error that occurred in any of the previous
      // promises in the chain.
    });

  const removeChallengeSubmission = ({ cardId, playerId }) => TICKLE_ENV_REF.collection('cards')
    .doc(cardId)
    .collection('challengeSubmissions')
    .doc(playerId)
    .delete()
    .catch((err) => {
      throw new Error(
        `error adding challengesubmission for ${playerId} ${cardId} ${err}`,
      );
    });

  return {
    getAllChallengeSubmissions,
    getOneChallengeSubmission,
    addChallengeSubmission,
    removeChallengeSubmission
  };
};

export default function DB(ENV_STR) {
  const TICKLE_ENV_REF = firestore.collection(CARD_ENVS).doc(ENV_STR);

  const challengeFuncs = makeChallengFuncs({ TICKLE_ENV_REF });
  const cardFuncs = makeCardFuncs({
    TICKLE_ENV_REF,
    ENV_STR,
    ...challengeFuncs
  });
  const userFuncs = makeUserFuncs({ TICKLE_ENV_REF, ENV_STR, ...cardFuncs });
  const commentFuncs = makeCommentFuncs({ TICKLE_ENV_REF });

  const addFileToEnv = ({ file, path, id }) => addFileToFirebaseStorage({ file, path: `${ENV_STR}/${path}`, id });

  return {
    ...challengeFuncs,
    ...cardFuncs,
    ...userFuncs,
    ...commentFuncs,
    addFileToEnv
  };
}
