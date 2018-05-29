import { firestore, storageRef } from '../firebase';

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

const removeFunctionFields = ({ uiColor, template, edit, ...rest }) =>
  Object.keys(rest).reduce((acc, attr) => {
    if (!(rest[attr] instanceof Function)) acc[attr] = rest[attr];
    return acc;
  }, {});

export const doCreateCard = (uid, card) => {
  console.log('img', card.img);
  const file = card.img ? card.img.file : null;

  const addToDb = newCard =>
    firestore
      .collection('users')
      .doc(uid)
      .collection('createdCards')
      .doc(newCard.id)
      .set(newCard);

  if (file !== null) {
    const imgRef = storageRef.child(`${file.name}${Date.now()}`);

    const metadata = { contentType: file.type };
    return imgRef
      .put(file, metadata)
      .then(() => imgRef.getDownloadURL())
      .then(url => {
        const newCard = {
          ...removeFunctionFields(card),
          img: { title: file.title, url }
        };
        return addToDb(newCard);
      });
  }
  return addToDb(removeFunctionFields(card));
  // imgRef.getDownloadURL().then(url => console.log('url', url));
};

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
