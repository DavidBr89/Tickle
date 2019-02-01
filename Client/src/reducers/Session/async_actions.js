import uniqBy from 'lodash/uniqBy';

import {auth} from '~/firebase';

import {removeFromStorage, addToStorage} from '~/firebase/db';

import {
  addUserToEnv,
  deleteUserFromEnv,
  createTmpUser,
  deleteUser,
  deleteTmpUser,
  getUser,
  readTmpUser,
  doCreateUser
} from '~/firebase/db/user_db';

import {userFields} from '~/constants/userFields';

import {
  setAuthUser,
  setAuthUserInfo,
  submitUserInfoToDBSuccess,
  errorSubmitUser,
  setUserEnv,
  receiveTopics,
  addTopic
} from './actions';

export function fetchUserInfo() {
  return function(dispatch, getState) {
    const {authUser} = getState().Session;
    const {uid} = authUser;
    // const db = new DB(userEnv);
    return getUser(uid)
      .then(usrInfo => {
        dispatch(setAuthUserInfo(userFields({uid, ...usrInfo})));
      })
      .catch(err => console.log('err', err));
  };
}

export function updateAuthUser(usr) {
  return (dispatch, getState) => {
    const {authUser} = getState().Session;
    const newUsr = {...authUser, ...usr};
    console.log('newUsr', newUsr);
    dispatch(setAuthUserInfo(newUsr));

    return doCreateUser(newUsr).then(usr => {
      console.log('usr Upd success', usr);
      // dispatch(setAuthUserInfo({...authUser}));
      // dispatch(setUserEnv(userEnv));
    });
  };
}

export function signUp({user, password, userEnvId}) {
  const {email, uid} = user;

  return dispatch => {
    const createUser = profile => {
      const {uid} = profile;
      return readTmpUser(email).then(presetUserInfo => {
        const {userEnvIds = []} = presetUserInfo;
        const info = {...presetUserInfo, ...profile};
        return doCreateUser(info)
          .then(() => {
            dispatch(setAuthUserInfo(info));
            // dispatch(setUserEnv(userEnv));
          })
          .then(() =>
            Promise.all(
              [userEnvId, ...userEnvIds].map(userEnvId =>
                addUserToEnv({uid, userEnvId})
              )
            )
          );
      });
    };

    return auth
      .doCreateUserWithEmailAndPassword(email, password)
      .then(res => {
        const {uid} = res.user;

        return createUser({...user, uid}).catch(e => {
          // TODO error handling in firebase function
          console.log('error', e);
          // on Error
          // readTmpUser(email).then(d => {
          //   const {userEnvIds} = d;
          //   // console.log('TMPUSER userEnvIds', userEnvIds);
          //   // Promise.all(
          //   //   userEnvIds.map(userEnvId =>
          //   //     deleteUserFromEnv({uid, userEnvId})
          //   //   )
          //   // );
          // });
          // createTmpUser(email);
          // deleteUser(uid);
        });
      });
  };
}

export const signIn = ({
  email,
  password,
  userEnvId,
  onSuccess = d => d,
  onError = d => d
}) => (dispatch, getState) =>
  auth.doSignInWithEmailAndPassword(email, password).then(resp => {
    console.log('userEnvId', userEnvId);
    const {user} = resp;
    const {uid} = user;

    return getUser(uid)
      .then(usrInfo => {
        dispatch(setAuthUserInfo(userFields({...usrInfo})));

        // TODO: validation
        // TODO: error
        dispatch(setUserEnv(userEnvId));
        return usrInfo;
      })
      .catch(err =>
        Promise.reject({
          code: 'User has not been found!',
          message: 'User has not been found!'
        })
      );
  });
// .catch(error => {
//   console.log('response failure', error);
//   return onError(error.message);
// });

export function removeUserFromEnv({uid, envId}) {
  return function(dispatch, getState) {
    return deleteUserFromEnv({uid})
      .then(usrInfo => {
        console.log('retrieve USR INFO ERR', usrInfo);
        // dispatch(setAuthUserInfo(updatedUserEnv));
      })
      .catch(err => console.log('err', err));
  };
}

export function registerUserToEnv({envId, newEnv}) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.
  return function(dispatch, getState) {
    // console.log('CALL WITH uid', uid);
    const {authUser} = getState().Session;
    // const { envId } = authUser;

    const {uid} = authUser;

    const {userEnvs} = authUser;

    const updatedUser = {userEnvs: uniqBy([...userEnvs, newEnv], 'id')};
    const db = DB(envId);

    return db
      .registerUserToEnv({uid, env: newEnv})
      .then(usrInfo => {
        dispatch(setAuthUserInfo(updatedUser));
      })
      .catch(err => console.log('err', err));
  };
}

// /TODO: CHECK DAVID
// export function updateAuthUserInfo({userEnv, ...userProfile}) {
//   return function(dispatch) {
//     const db = DB(userEnv);
//     // dispatch(setAuthUserInfo(userFields(userProfile)));
//     return db
//       .doCreateUser(userProfile)
//       .then(usrInfo => {
//         dispatch(setAuthUserInfo(userFields(userProfile)));
//       })
//       .catch(err => console.log('err', err));
//   };
// }

export function selectUserEnv(env) {
  return function(dispatch, getState) {
    const {authUser} = getState().Session;
    const {userEnvs, uid} = authUser;
    console.log('authUser', authUser);

    // const db = DB(getSelectedUserEnv(env.id));

    // const newUserEnvs = userEnvs.map(u => ({...u, selected: u.id === env.id}));

    dispatch(setUserEnv(env));

    // return db
    //   .registerUserToEnv({uid, env})
    //   .then(usrInfo => {
    //     console.log('retrieve USR INFO', usrInfo);
    //     dispatch(setAuthUserInfo({userEnvs: newUserEnvs}));
    //   })
    //   .catch(err => console.log('err', err));
  };
}
