import { firestore } from '../firebase';

export const doCreateUser = (id, username, email) =>
  firestore.collection('users').add({
    id,
    username,
    email
  });

export const onceGetUsers = () => firestore.collection('users').get();

const removeFunctionFields = obj =>
  Object.keys(obj).reduce((acc, attr) => {
    if (!(obj[attr] instanceof Function)) acc[attr] = obj[attr];
    return acc;
  }, {});

export const doCreateCard = card =>
  firestore
    .collection('cards')
    .doc(card.id)
    .set(removeFunctionFields(card));

export const doUpdateCard = card =>
  firestore
    .collection('cards')
    .doc(card.id)
    .set(removeFunctionFields(card));

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
