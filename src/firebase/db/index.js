import { firestore, storageRef } from '../firebase';

const removeFunctionFields = ({ uiColor, template, edit, ...rest }) =>
  Object.keys(rest).reduce((acc, attr) => {
    if (!(rest[attr] instanceof Function)) acc[attr] = rest[attr];
    return acc;
  }, {});

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

export const addImgToStorage = file => {
  const metadata = { contentType: file.type };
  const imgRef = storageRef.child(`images/${file.name}${Date.now()}`);
  console.log('metadata', metadata, 'imgRef', imgRef);
  return imgRef
    .put(file, metadata)
    .then(() => new Promise(resolve => resolve(imgRef.getDownloadURL())));
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
const uploadImgFields = card => {
  const cardImgFile = card.img ? card.img.file : null;
  const cardChallengeFile =
    card.challenge !== null && card.challenge.img
      ? card.challenge.img.file
      : null;

  // TODO update
  const cardImgPromise = cardImgFile
    ? addImgToStorage(cardImgFile).then(url => {
      const img = {
        title: card.img.title || cardImgFile.name,
        url
      };
      return new Promise(resolve => resolve({ img }));
    })
    : {};
  // card.img = null;

  const challImgPromise = cardChallengeFile
    ? addImgToStorage(cardChallengeFile).then(url => {
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
    const newCard = { ...removeFunctionFields(card), ...imgFields };
    return newCard;
  });
};

export const doCreateUser = userProfile =>
  firestore
    .collection('users')
    .doc(userProfile.uid)
    .set(userProfile);

export const getUserInfo = uid =>
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
  firestore
    .collection('users')
    .doc(uid)
    .get()
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
        const imgFields = values.reduce((acc, d) => ({ ...acc, ...d }));
      })
    )
    .catch(err => console.log('err i getUser'));

export const onceGetUsers = () => firestore.collection('users').get();

export const doCreateCard = (uid, card) =>
  uploadImgFields(card).then(c => {
    // TODO
    if (c.id == 'temp') {
      console.log('temp to create');
      throw 'error: temp card to create';
    }
    return firestore
      .collection('users')
      .doc(uid)
      .collection('createdCards')
      .doc(c.id)
      .set(c);
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
