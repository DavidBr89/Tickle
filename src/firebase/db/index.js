import { firestore, storageRef } from '../firebase';

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

export const readCards = (uid, collectionName = 'readableCards') =>
  firestore
    .collection('users')
    .doc(uid)
    .collection(collectionName)
    .get()
    .then(querySnapshot => {
      const data = [];
      querySnapshot.forEach(doc => data.push(doc.data()));
      return new Promise(
        resolve => resolve(data),
        error => console.log('error in readCards', error)
      );
    });

function getChallengeSubmissions(uid, cid) {
  const chSub = firestore
    .collection('users')
    .doc(uid)
    .collection('createdCards')
    .doc(cid)
    .collection('challengeSubmissions');

  console.log('getdata', 'challenge');
  const challengeSubmissions = [];
  return chSub.get().then(snapshot => {
    console.log('snapshot', snapshot);
    snapshot.forEach(item => {
      const d = item.data(); // will have 'todo_item.title' and 'todo_item.completed'
      console.log('item data', d);
      challengeSubmissions.push(d);
    });
    return new Promise(resolve => resolve(challengeSubmissions));
  });
}

export const getCardsWithSubmissions = uid =>
  firestore
    .collection('users')
    .doc(uid)
    .collection('createdCards')
    .get()
    .then(querySnapshot => {
      const data = [];
      const pendingPromises = [];
      querySnapshot.forEach(doc => {
        const d = doc.data();
        // data.push(d);
        // TODO: change async await
        // TODO: change async await
        // TODO: change async await
        // TODO: change async await
        pendingPromises.push(
          getChallengeSubmissions(uid, d.id).then(challengeSubmissions => {
            data.push({ ...d, challengeSubmissions });
          })
        );
      });
      return Promise.all(pendingPromises).then(
        () =>
          new Promise(
            resolve => resolve(data),
            error => console.log('error in readCards', error)
          )
      );
    });

export const addImgToStorage = ({ file, uid, path = 'cards' }) => {
  const metadata = { contentType: file.type };
  const imgRef = storageRef.child(`images/${uid}/${path}/${file.name}`);
  console.log('metadata', metadata, 'imgRef', imgRef);
  return imgRef
    .put(file, metadata)
    .then(() => new Promise(resolve => resolve(imgRef.getDownloadURL())))
    .catch(err => {
      throw new Error(`error in uploading img for ${uid}`);
      // Handle any error that occurred in any of the previous
      // promises in the chain.
    });
};

export const testAddImgToStorage = file => {
  // const metadata = { contentType: file.type };
  const imgRef = storageRef.child(`${file.name}${Date.now()}`);
  console.log('imgRef', imgRef);
  return imgRef
    .put(file)
    .then(() => new Promise(resolve => resolve(imgRef.getDownloadURL())));
};

// TODO: error handling
const uploadImgFields = (card, uid) => {
  console.log('card.img', card.img);
  const cardImgFile = card.img ? card.img.file : null;
  const cardChallengeFile =
    card.challenge !== null && card.challenge.img
      ? card.challenge.img.file
      : null;

  // TODO update
  const cardImgPromise = cardImgFile
    ? addImgToStorage({ file: cardImgFile, uid, path: 'cards' }).then(url => {
      const img = {
        title: card.img.title || cardImgFile.name,
        url
      };
      return new Promise(resolve => resolve({ img }));
    })
    : {};
  // card.img = null;

  const challImgPromise = cardChallengeFile
    ? addImgToStorage({ file: cardChallengeFile, uid, path: 'challenge' }).then(
      url => {
        const challenge = {
          img: {
            title: cardChallengeFile.name,
            url
          }
          };
        return new Promise(resolve => resolve({ challenge }));
      }
    )
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

export const getDetailedUserInfo = uid =>
  getUser(uid)
    .then(doc =>
      Promise.all([
        readCards(uid, 'readableCards'),
        readCards(uid, 'createdCards'),
        readCards(uid, 'collectedCards')
      ]).then(values => {
        console.log('values', values);
        const usr = doc.data();
        return new Promise(
          resolve =>
            resolve({
              ...usr,
              readableCards: values[0],
              createdCards: values[1],
              collectedCards: values[2]
            }),
          error => console.log('error in getUser, doc not existing', error)
        );
        // const imgFields = values.reduce((acc, d) => ({ ...acc, ...d }));
      })
    )
    .catch(err => console.log('err i getUser'));

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

export const doCreateCard = (uid, card) =>
  uploadImgFields(card, uid).then(imgFields => {
    // TODO
    if (card.id === 'temp') {
      console.log('temp to create');
      throw 'error: temp card to create';
    } else {
      const newCard = pruneFields({ ...card, ...imgFields });
      // TODO: make explicit
      // const cardData = {floorX, floorY, id, img, loc, media, title, tags}
      return firestore
        .collection('users')
        .doc(uid)
        .collection('createdCards')
        .doc(newCard.id)
        .set(newCard);
    }
  });

// TODO: change later
export const doUpdateCard = doCreateCard;

export const doDeleteCard = (uid, cid) =>
  firestore
    .collection('users')
    .doc(uid)
    .collection('createdCards')
    .doc(cid)
    .delete();

// Add a new document with a generated id.
export const addComment = ({ authorId, cardId, text }) =>
  firestore
    .collection('users')
    .doc(authorId)
    .collection('createdCards')
    .doc(cardId)
    .collection('comments')
    .add({ text, authorId, date: new Date() });

export const readComments = ({ authorId, cardId }) =>
  firestore
    .collection('users')
    .doc(authorId)
    .collection('createdCards')
    .doc(cardId)
    .collection('comments')
    .get()
    .then(querySnapshot => {
      const comments = [];
      querySnapshot.forEach(doc => comments.push(doc.data()));
      return new Promise(
        resolve => resolve(comments),
        error => console.log('error in readComments', error)
      );
    });

export const addChallengeSubmission = ({
  uid,
  cardId,
  playerId,
  challengeData
}) => {
  const { file, ...restChallengeSub } = challengeData;
  return addImgToStorage({ file, uid, path: 'challengeSubmissions' }).then(
    imgUrl =>
      firestore
        .collection('users')
        .doc(uid)
        .collection('createdCards')
        .doc(cardId)
        .collection('challengeSubmissions')
        .doc(playerId)
        .set({ ...restChallengeSub, imgUrl, date: new Date() })
        .catch(err => {
          throw new Error(`error in uploading img for ${uid}`);
          // Handle any error that occurred in any of the previous
          // promises in the chain.
        })
  );
};

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
