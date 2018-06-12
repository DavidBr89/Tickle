import { firestore, storageRef } from '../firebase';

const removeFunctionFields = ({ uiColor, template, edit, ...rest }) =>
  Object.keys(rest).reduce((acc, attr) => {
    if (!(rest[attr] instanceof Function)) acc[attr] = rest[attr];
    return acc;
  }, {});

const addImgToStorage = file => {
  const metadata = { contentType: file.type };
  const imgRef = storageRef.child(`${file.name}${Date.now()}`);
  return imgRef
    .put(file, metadata)
    .then(() => new Promise(resolve => resolve(imgRef.getDownloadURL())));
};

// TODO: error handling
const uploadImgFields = card => {
  const cardImgFile = card.img ? card.img.file : null;
  const cardChallengeFile =
    card.challenge !== null ? card.challenge.img.file : null;

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

export const doCreateUser = (id, username, email) =>
  firestore
    .collection('users')
    .doc(id)
    .set({
      id,
      username,
      email
    });

export const onceGetUsers = () => firestore.collection('users').get();

export const doCreateCard = (uid, card) => {

  console.log('createCard', card)
  return uploadImgFields(card).then(c =>
    firestore
      .collection('users')
      .doc(uid)
      .collection('createdCards')
      .doc(c.id)
      .set(c)
  );
}

// TODO: change later
export const doUpdateCard = doCreateCard;

export const doDeleteCard = (uid, cid) =>
  firestore
    .collection('users')
    .doc(uid)
    .collection('createdCards')
    .doc(cid)
    .delete();

export const readCards = (uid, collectionName = 'readableCards') =>
  firestore
    .collection('users')
    .doc(uid)
    .collection(collectionName)
    .get();

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
