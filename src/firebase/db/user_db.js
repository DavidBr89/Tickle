import {thumbFileName} from './utils_db';

import {firestore, Timestamp, storageRef} from '../firebase';

import makeCardFuncs from './card_db';

export const readAllUserEnvs = () =>
  firestore
    .collection('card-environments')
    .get()
    .then(querySnapshot => {
      const data = [];
      querySnapshot.forEach(doc => data.push(doc.data()));
      return data;
    })
    .catch(err => console.log('err  getUser'));

export const createUserEnv = ({id, ...rest}) =>
  firestore
    .collection('card-environments')
    .doc(id)
    .set({id, ...rest});

export const addUserToEnv = ({uid, userEnvId}) =>
  firestore
    .collection('card-environments')
    .doc(userEnvId)
    .collection('users')
    .doc(uid)
    .set({uid})
    .catch(err => console.log('addUserToEnv err', err));

export const readAllUsers = () =>
  firestore
    .collection('users')
    .get()
    .then(querySnapshot => {
      const data = [];
      querySnapshot.forEach(doc => data.push(doc.data()));

      const dataPromises = data.map(d => {
        const thumbNailRef = storageRef.child(
          `/images/usr/${thumbFileName(d.uid)}`,
        );
        // return d;
        return thumbNailRef.getDownloadURL().then(
          url => ({...d, thumbnail: url}),
          err => {
            // TODO: check later
            const img = {...d, thumbnail: null};
            return {...d, ...img};
          },
        );
      });

      return Promise.all(dataPromises).catch(error =>
        console.log('error in reading users', error),
      );
    });

export const readAllTmpUsers = () =>
  firestore
    .collection('tmp-users')
    .get()
    .then(querySnapshot => {
      const data = [];
      querySnapshot.forEach(doc => {
        const d = doc.data();
        data.push(d);
      });
      return data;
    });

export const removeTmpUser = email =>
  firestore
    .collection('tmp-users')
    .doc(email)
    .get().delete;

export const readTmpUser = email =>
  firestore
    .collection('tmp-users')
    .doc(email)
    .get()
    .then(doc => {
      const usr = doc.data() || {};
      return usr;
    });

export const createTmpUser = user =>
  firestore
    .collection('tmp-users')
    .doc(user.email)
    .set(user);

// TODO change later

export const getOneUserByEmail = (email, tmp = false) =>
  firestore
    .collection(tmp ? 'tmpUsers' : 'users')
    .where('email', '==', email)
    .get()
    .then(querySnapshot => {
      const data = [];
      querySnapshot.forEach(doc => {
        const d = doc.data();
        data.push(d);
      });
      return data.length > 0 ? data[0] : null;
    });

export const getUser = uid =>
  firestore
    .collection('users')
    .doc(uid)
    .get()
    .then(doc => {
      const usr = doc.data();
      // console.log('USR RESULT', usr);
      if (!usr) {
        return Promise.reject({
          code: 'User has not been registered to environment!',
          message: 'User has not been registered to environment!',
        });
      }
      return readAllUserEnvs(uid).then(userEnvs => ({...usr, userEnvs}));
    });

export const getThumbNailRef = uid =>
  storageRef.child(`/images/usr/${thumbFileName(uid)}`);

export const getUserEnvs = uid =>
  firestore
    .collection('card-environments')
    .get()
    .then(querySnapshot =>
      Promise.all(
        querySnapshot.docs.map(envDoc => {
          const env = envDoc.data();

          return firestore
            .collection('card-environments')
            .doc(env.id)
            .collection('users')
            .get()
            .then(qs => qs.docs.map(d => d.data().uid))
            .then(userIds => (userIds.includes(uid) ? env : null));
        }),
      ),
    )
    .then(res => res.filter(d => d !== null));

export const readUserIdsFromEnv = envId =>
  firestore
    .collection('card-environments')
    .doc(envId)
    .collection('users')
    .get()
    .then(querySnapshot => {
      const data = [];
      querySnapshot.forEach(doc => data.push(doc.data()));
      return data;
    });

// .catch(err => console.log('err  gkkketUser', err));

export const getDetailedUserInfo = ({ uid, userEnvId }) => {
  const {readCards} = makeCardFuncs(userEnvId);
  return getUser(uid)
    .then(usr =>
      readCards({authorId: uid}).then(createdCards => ({
        ...usr,
        createdCards,
        collectedCards: [],
      })),
    )
    .catch(err => console.log('err i getUser', err));
};

export const addUserToEnvSet = ({uid, userEnvSet}) =>
  Promise.all(userEnvSet.map(u => addUserToEnv({uid, userEnv: u})));

export const removeUserFromEnv = ({userEnvId, uid}) =>
  firestore
    .collection('card-environments')
    .doc(userEnvId)
    .collection('users')
    .doc(uid)
    .delete()
    .catch(err => console.log('addUserToEnv err', err));

export const doCreateUser = userProfile =>
  firestore
    .collection('users')
    // TODO: verify later
    .doc(userProfile.uid)
    .set(userProfile);
