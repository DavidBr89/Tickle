import { firestore, storageRef } from '../firebase';
import { extractCardFields } from 'Constants/cardFields';

const USERS = 'users';

const TICKLE_ENVS = 'tickle-environments';

/* testing enviroments */
const VDS_GEO = 'vds-geo';
const VDS_TOPIC = 'vds-topic';
const STAGING = 'vds-topic';
const PEDAGOGY_DEP = 'pedagogy-dep';

const ENV = STAGING; // VDS_TOPIC;

const TICKLE_DOC_REF = firestore.collection(TICKLE_ENVS).doc(ENV);

// TICKLE_DOC_REF.get().then(e => console.log('yeah env', e.data()));

const isDefined = a => a !== null && a !== undefined;

const pruneFields = fields => {
  const isNotFileOrFunc = val =>
    !(val instanceof File) && !(val instanceof Function);

  const pruneObject = obj =>
    Object.keys(obj).reduce((acc, attr) => {
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

const getShallowCards = (uid = null) => {
  // console.log('UID', uid);
  const refCards =
    uid !== null
      ? TICKLE_DOC_REF.collection('cards') // .where('uid', '==', uid)
      : TICKLE_DOC_REF.collection('cards');

  return refCards.get().then(querySnapshot => {
    const data = [];
    querySnapshot.forEach(doc => {
      // const timestamp = doc.get('created_at');
      // console.log('timestamp', timestamp);
      // const date = timestamp.toDate();
      const d = doc.data();

      data.push({ ...d });
    });

    console.log('retrieved cards', data);

    // TODO; remove later
    const dataPromises = data.map(d => {
      if (!d.img) return d;

      const thumbNailRef = storageRef.child(
        `${ENV}/images/cards/${thumbFileName(d.id)}`
      );
      // return d;
      return thumbNailRef.getDownloadURL().then(
        url => ({ ...d, img: { ...d.img, thumbnail: url } }),
        err => {
          const img = { ...d.img, thumbnail: null };
          return { ...d, ...img };
        }
      );
    });

    return Promise.all(dataPromises);
  });
};

export const readCards = (fromUID, playerId) =>
  getShallowCards(fromUID).then(data => {
    const pendingPromises = data.map(d =>
      getOneChallengeSubmission(d.id, playerId).then(
        challengeSubmission =>
          new Promise(resolve => resolve({ ...d, challengeSubmission }))
      )
    );
    return Promise.all(pendingPromises).then(
      data =>
        new Promise(
          resolve => resolve(data),
          error => console.log('error in readCards', error)
        )
    );
  });

export const readCopyUsers = () => {
  console.log('readCopyUsers');
  firestore
    .collection('staging_vds_geo_cards')
    .get()
    .then(querySnapshot => {
      const data = [];
      querySnapshot.forEach(doc => {
        const d = doc.data();
        data.push(d);
      });

      data.forEach(d =>
        firestore
          .collection('tickle-environments')
          .doc('staging')
          .collection('cards')
          .doc(d.id)
          .set(d)
      );
    });
};

function getAllChallengeSubmissions(cid) {
  const chSub = TICKLE_DOC_REF.collection('cards')
    .doc(cid)
    .collection('challengeSubmissions');

  const challengeSubmissions = [];
  return chSub.get().then(snapshot => {
    snapshot.forEach(item => {
      const d = item.data(); // will have 'todo_item.title' and 'todo_item.completed'
      // console.log('challengeSub', item);
      challengeSubmissions.push({ ...d, cardId: cid, playerId: item.id });
    });
    return new Promise(resolve => resolve(challengeSubmissions));
  });
}

function getOneChallengeSubmission(cid, playerId) {
  return TICKLE_DOC_REF.collection('cards')
    .doc(cid)
    .collection('challengeSubmissions')
    .doc(playerId)
    .get()
    .then(doc => new Promise(resolve => resolve(doc.data() || null)));
}

export function getOneEmailUser(email) {
  return TICKLE_DOC_REF.collection('users')
    .where('email', '==', email)
    .get()
    .then(sn => sn.forEach(d => console.log('d', d.data())));
}

export const readCardsWithSubmissions = uid =>
  getShallowCards(uid).then(data => {
    const pendingPromises = data.map(d =>
      getAllChallengeSubmissions(d.id).then(
        allChallengeSubmissions =>
          new Promise(resolve => resolve({ ...d, allChallengeSubmissions }))
      )
    );
    return Promise.all(pendingPromises).then(results =>
      new Promise(resolve => resolve(results)).catch(err => {
        throw new Error(`error in reading cards with submissions ${err}`);
      })
    );
  });

export const addFileToStorage = ({ file, path }) => {
  const metadata = { contentType: file.type };
  const imgRef = storageRef.child(`${ENV}/${path}`);
  return imgRef
    .put(file, metadata)
    .then(() => new Promise(resolve => resolve(imgRef.getDownloadURL())))
    .catch(err => {
      throw new Error(`error in uploading img for ${file.name}`);
      // Handle any error that occurred in any of the previous
      // promises in the chain.
    });
};

export const removeFromStorage = path => {
  const imgRef = storageRef.child(path);
  return imgRef.delete().catch(error => {
    console.log('error', error);
    throw new Error(`error in deleting file${path} ${error}`);
  });
};

export const addImgToStorage = ({ file, path, id }) => {
  const metadata = { contentType: file.type };
  const imgRef = storageRef.child(`${ENV}/images/${path}/${id}`);
  return imgRef
    .put(file, metadata)
    .then(() => new Promise(resolve => resolve(imgRef.getDownloadURL())))
    .catch(err => {
      console.log('err', err);
      throw new Error(`error in uploading img for ${file.name}`);
      // Handle any error that occurred in any of the previous
      // promises in the chain.
    });
};

// TODO: error handling
const uploadImgFields = card => {
  if (card.img === null) return new Promise(resolve => resolve(null));

  const { file = null, ...restImgFields } = card.img;

  return file
    ? addImgToStorage({
        file,
      path: `${ENV}/cards`,
        id: card.id
      }).then(url => {
        const img = {
          ...restImgFields,
          url
        };
        return new Promise(resolve => resolve(img));
      })
    : new Promise(resolve => resolve({ ...restImgFields }));
};

export const doCreateUser = userProfile =>
  TICKLE_DOC_REF.collection('users')
    .doc(userProfile.uid)
    .set(userProfile);

export const getUser = uid =>
  TICKLE_DOC_REF.collection('users')
    .doc(uid)
    .get()
    .then(
      doc =>
        new Promise(
          resolve => resolve(doc.data()),
          error => console.log('error in getUser, doc not existing', error)
        )
    )
    .catch(err => console.log('err  getUser'));

// TODO
// TODO
// TODO
// TODO
// TODO
// TODO
// TODO
// const haaike = 'PpNOHOQLtXatZzcaAYVCMQQP5XT2';
export const getDetailedUserInfo = uid =>
  getUser(uid)
    .then(
      usr =>
        new Promise(resolve =>
          resolve({
            ...usr,
            readableCards: [],
            createdCards: [],
            collectedCards: [],
            submittedCards: [],
            startedCards: []
          })
        )
    )
    .catch(err => console.log('err i getUser', err));

export const onceGetUsers = () =>
  TICKLE_DOC_REF.collection('users')
    .get()
    .then(querySnapshot => {
      const data = [];
      querySnapshot.forEach(doc => data.push(doc.data()));
      console.log('data', data);

      const dataPromises = data.map(d => {
        const thumbNailRef = storageRef.child(
          `${ENV}/images/usr/${thumbFileName(d.uid)}`
        );
        // return d;
        return thumbNailRef.getDownloadURL().then(
          url => ({ ...d, thumbnail: url }),
          err => {
            // TODO: check later
            const img = { ...d, thumbnail: null };
            return { ...d, ...img };
          }
        );
      });

      return Promise.all(dataPromises).catch(error =>
        console.log('error in reading users', error)
      );
    });

export const doCreateCard = card =>
  uploadImgFields(card).then(img => {
    if (card.id === 'temp') {
      throw Error('error: temp card to create');
    } else {
      const timestamp = null; // firestore.FieldValue.serverTimestamp();
      const newCard = extractCardFields({ ...card, img, timestamp });
      console.log('newCard', newCard);

      return TICKLE_DOC_REF.collection('cards')
        .doc(newCard.id)
        .set(newCard);
    }
  });

// TODO: change later
export const doUpdateCard = doCreateCard;

export const doDeleteCard = cid =>
  TICKLE_DOC_REF.collection('cards')
    .doc(cid)
    .delete();

// Add a new document with a generated id.
export const addComment = ({ uid, cardId, text }) =>
  TICKLE_DOC_REF.collection('cardComments')
    .doc(cardId)
    .collection('comments')
    // TODO: change later will break in future firebase release
    // TODO: change later
    .add({ uid, text, date: new Date() });

export const readComments = cardId =>
  TICKLE_DOC_REF.collection('cardComments')
    .doc(cardId)
    .collection('comments')
    .get()
    .then(querySnapshot => {
      const comments = [];
      querySnapshot.forEach(doc => comments.push(doc.data()));
      querySnapshot.forEach(doc => console.log('yo', doc.data()));
      console.log('querySnapshot', querySnapshot);
      return new Promise(
        resolve => resolve(comments),
        error => console.log('error in readComments', error)
      );
    });

export const removeChallengeSubmission = ({ cardId, playerId }) =>
  TICKLE_DOC_REF.collection('cards')
    .doc(cardId)
    .collection('challengeSubmissions')
    .doc(playerId)
    .delete()
    .catch(err => {
      throw new Error(
        `error adding challengesubmission for ${playerId} ${cardId} ${err}`
      );
    });

export const addChallengeSubmission = ({ cardId, playerId, challengeData }) =>
  TICKLE_DOC_REF.collection('cards')
    .doc(cardId)
    .collection('challengeSubmissions')
    .doc(playerId)
    .set({ ...challengeData, date: new Date(), playerId, cardId })
    .catch(err => {
      throw new Error(
        `error adding challengesubmission for ${playerId} ${err}`
      );
      // Handle any error that occurred in any of the previous
      // promises in the chain.
    });

export function getOneUser(playerId) {
  return TICKLE_DOC_REF.collection('users')
    .doc(playerId)
    .get()
    .then(doc => new Promise(resolve => resolve(doc.data() || {})))
    .then(d => console.log('user EMAIL', d.email));
}
