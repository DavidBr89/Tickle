import { firestore, storageRef } from '../firebase';
import { extractCardFields } from 'Constants/cardFields';

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

const CARDS = 'tmpCards';
const getShallowCards = uid =>
  firestore
    .collection(CARDS)
    .where('uid', '==', uid)
    .get()
    .then(querySnapshot => {
      const data = [];
      querySnapshot.forEach(doc => {
        const d = doc.data();
        data.push(d);
      });

      return new Promise(
        resolve => resolve(data),
        error => console.log('error in readCards', error)
      );
    });

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

export const readCopyOlga = () => {
  console.log('readCopyOlga');
  firestore
    .collection('cards')
    .get()
    .then(querySnapshot => {
      const data = [];
      querySnapshot.forEach(doc => {
        const d = doc.data();
        data.push(d);
      });

      data.forEach(d =>
        firestore
          .collection('tmpCards')
          .doc(d.id)
          .set(d)
      );
    });
};

function getAllChallengeSubmissions(cid) {
  const chSub = firestore
    .collection(CARDS)
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
  return firestore
    .collection(CARDS)
    .doc(cid)
    .collection('challengeSubmissions')
    .doc(playerId)
    .get()
    .then(doc => new Promise(resolve => resolve(doc.data() || null)));
}

export const readCardsWithSubmissions = uid =>
  getShallowCards(uid).then(data => {
    const pendingPromises = data.map(d =>
      getAllChallengeSubmissions(d.id).then(challengeSubmissions => {
        return new Promise(resolve => resolve({ ...d, challengeSubmissions }));
      })
    );
    return Promise.all(pendingPromises).then(results =>
      new Promise(resolve => resolve(results)).catch(err => {
        throw new Error(`error in reading cards with submissions ${err}`);
      })
    );
  });

export const addFileToStorage = ({ file, path }) => {
  const metadata = { contentType: file.type };
  const imgRef = storageRef.child(path);
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

export const addImgToStorage = ({ file, path }) => {
  const metadata = { contentType: file.type };
  const imgRef = storageRef.child(`images/${path}`);
  return imgRef
    .put(file, metadata)
    .then(
      () =>
        new Promise(resolve => {
          console.log('imgRef', imgRef);
          return resolve(imgRef.getDownloadURL());
        })
    )
    .catch(err => {
      console.log('err', err);
      throw new Error(`error in uploading img for ${file.name}`);
      // Handle any error that occurred in any of the previous
      // promises in the chain.
    });
};

// TODO: error handling
const uploadImgFields = card => {
  // console.log('card db', card);
  const cardImgFile = card.img ? card.img.file : null;
  const cardChallengeFile =
    card.challenge !== null && card.challenge.img
      ? card.challenge.img.file
      : null;

  // TODO update
  const cardImgPromise = cardImgFile
    ? addImgToStorage({
      file: cardImgFile,
      path: `cards/${card.id}`
    }).then(url => {
      const img = {
        title: card.img.title || cardImgFile.name,
        url
      };
      return new Promise(resolve => resolve({ img }));
    })
    : {};
  // card.img = null;

  const challImgPromise = cardChallengeFile
    ? addImgToStorage({
      file: cardChallengeFile,
      // TODO: fix cards with more challenges
      path: `challenges/${card.id}`
    }).then(url => {
      const challenge = {
        img: {
          title: cardChallengeFile.name,
          url
        }
      };
      return new Promise(resolve => resolve({ challenge }));
    })
    : {};

  return Promise.all([cardImgPromise, challImgPromise]).then(values => {
    const imgFields = values.reduce((acc, d) => ({ ...acc, ...d }));
    return imgFields;
  });
};

export const doCreateUser = userProfile =>
  firestore
    .collection('users')
    .doc(userProfile.uid)
    .set(userProfile);

export const getUser = uid =>
  firestore
    .collection('users')
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
const haaike = 'PpNOHOQLtXatZzcaAYVCMQQP5XT2';
export const getDetailedUserInfo = uid =>
  getUser(uid)
    .then(usr =>
      readCards(haaike, uid).then(
        cards =>
          new Promise(resolve =>
            resolve({
              ...usr,
              readableCards: [],
              createdCards: cards.filter(c => c.uid === uid),
              // TODO
              collectedCards: cards.filter(
                c =>
                  isDefined(c.challengeSubmission) &&
                  c.challengeSubmission.accomplished
              ),
              submittedCards: cards.filter(
                c =>
                  isDefined(c.challengeSubmission) &&
                  c.challengeSubmission.completed
              ),
              startedCards: cards.filter(
                c =>
                  isDefined(c.challengeSubmission) &&
                  !c.challengeSubmission.completed
              )
            })
          )
      )
    )
    .catch(err => console.log('err i getUser', err));

export const onceGetUsers = () =>
  firestore
    .collection('users')
    .get()
    .then(querySnapshot => {
      const data = [];
      querySnapshot.forEach(doc => data.push(doc.data()));
      console.log('data', data);
      return new Promise(
        resolve => resolve(data),
        error => console.log('error in reading users', error)
      );
    });

export const doCreateCard = card =>
  uploadImgFields(card).then(imgFields => {
    if (card.id === 'temp') {
      throw Error('error: temp card to create');
    } else {
      const newCard = extractCardFields({ ...card, ...imgFields });
      console.log('newCard', newCard);
      // TODO: make explicit
      // const cardData = {floorX, floorY, id, img, loc, media, title, tags}
      return firestore
        .collection(CARDS)
        .doc(newCard.id)
        .set(newCard);
    }
  });

// TODO: change later
export const doUpdateCard = doCreateCard;

export const doDeleteCard = cid =>
  firestore
    .collection(CARDS)
    .doc(cid)
    .delete();

// Add a new document with a generated id.
export const addComment = ({ uid, cardId, text }) =>
  firestore
    .collection('cardComments')
    .doc(cardId)
    .collection('comments')
    // TODO: change later will break in future firebase release
    // TODO: change later
    .add({ uid, text, date: new Date() });

export const readComments = cardId =>
  firestore
    .collection('cardComments')
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
  firestore
    .collection(CARDS)
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
  firestore
    .collection(CARDS)
    .doc(cardId)
    .collection('challengeSubmissions')
    .doc(playerId)
    .set({ ...challengeData, date: new Date(), playerId })
    .catch(err => {
      throw new Error(
        `error adding challengesubmission for ${playerId} ${err}`
      );
      // Handle any error that occurred in any of the previous
      // promises in the chain.
    });
// );

// TODO: get authored cards
// return firebase.firestore
//   .collection('authoredCards')
//   .get()
//   .then(querySnapshot => {
//     const data = [];
//     querySnapshot.forEach(doc => data.push({ ...doc.data(), id: doc.id }));
//     dispatch(receiveAuthoredCards(data));
//   });

// export const onceGetUsers = () => db.ref('users').once('value');

// export default firestore;
