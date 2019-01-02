import uniqBy from 'lodash/uniqBy';

import {createDbEnv, DB, auth} from 'Firebase';
import {
  addFileToStorageBase,
  getUser,
  readTmpUser,
  addUserToEnvSet,
  removeTmpUser,
  doCreateUser,
} from 'Firebase/db';

import {userFields} from 'Constants/userFields';
import {
  setAuthUser,
  setAuthUserInfo,
  submitUserInfoToDBSuccess,
  errorSubmitUser,
  setUserEnv,
} from './actions';

export function fetchUserInfo({uid, userEnv}) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.
  return function(dispatch) {
    const db = new DB(userEnv);
    return getUser(uid)
      .then(usrInfo => {
        dispatch(setAuthUserInfo(userFields({uid, ...usrInfo})));
      })
      .catch(err => console.log('err', err));
  };
}

export function signUp({user, password, img, userEnv}) {
  const {email} = user;

  return dispatch => {
    const db = DB(userEnv);

    const createUser = profile =>
      readTmpUser(profile.email)
        .then(presetInfo =>
          doCreateUser({...presetInfo, ...profile}).then(authUser => {
            const {userEnvSet} = presetInfo;
            // TODO: ADD USER ENVS
            // addUserToEnvSet({uid: profile.uid, userEnvSet}).then(env => ({
            //   ...presetInfo,
            //   userEnvs: [env],
            // }));
            dispatch(setAuthUserInfo({...authUser}));
            dispatch(setUserEnv(userEnv));
          }),
        )
        .then(() => removeTmpUser());

    return auth.doCreateUserWithEmailAndPassword(email, password).then(res => {
      const {uid} = res.user;

      if (img !== null) {
        return addFileToStorageBase({
          file: img.file,
          path: `/images/usr/${uid}`,
        })
          .then(imgUrl => {
            const userAndImg = {...user, uid, photoURL: imgUrl};
            createUser(userAndImg);
          })
          .catch(error => {
            this.setState({error, loading: false});
          });
      }
      return createUser({...user, uid});
    });
  };
}

export const signIn = ({
  email,
  password,
  userEnvId,
  onSuccess = d => d,
  onError = d => d,
}) => (dispatch, getState) =>
  auth.doSignInWithEmailAndPassword(email, password).then(resp => {
    const {user} = resp;
    const {uid} = user;

    return getUser(uid)
      .then(usrInfo => {
        dispatch(setAuthUserInfo(userFields({...usrInfo, envId: userEnvId})));

        // TODO: validation
        // TODO: error
        dispatch(setUserEnv(userEnvId));
        return usrInfo;
      })
      .catch(err =>
        Promise.reject({
          code: 'User has not been found!',
          message: 'User has not been found!',
        }),
      );
  });
// .catch(error => {
//   console.log('response failure', error);
//   return onError(error.message);
// });

export function removeUserFromEnv({uid, envId}) {
  const db = DB(envId);
  return function(dispatch, getState) {
    // console.log('CALL WITH uid', uid);
    const {authUser} = getState().Session;
    const {userEnvs, uid} = authUser;

    const updatedUserEnv = {userEnvs: userEnvs.filter(u => u.id !== envId)};

    return db
      .removeUserFromEnv({uid})
      .then(usrInfo => {
        console.log('retrieve USR INFO', usrInfo);
        dispatch(setAuthUserInfo(updatedUserEnv));
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
export function updateAuthUserInfo({userEnv, ...userProfile}) {
  return function(dispatch) {
    const db = DB(userEnv);
    // dispatch(setAuthUserInfo(userFields(userProfile)));
    return db
      .doCreateUser(userProfile)
      .then(usrInfo => {
        dispatch(setAuthUserInfo(userFields(userProfile)));
      })
      .catch(err => console.log('err', err));
  };
}

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

// export function submitUserInfoToDB({ userData, userEnv }) {
//   return function(dispatch) {
//     const db = DB(userEnv);
//     // dispatch(setAuthUserInfo(userInfo));
//
//     const usr = userFields(userData);
//     const submitUserDispatchWrapper = () => {
//       const { file, uid } = userData;
//       if (file) {
//         return db
//           .addFileToEnv({ file, path: 'users/images', id: uid })
//           .then((photoURL) => {
//             const newUsr = { ...usr, photoURL };
//             db.doCreateUser(newUsr).then(() => {
//               dispatch(submitUserInfoToDBSuccess(newUsr));
//             });
//           });
//       }
//       return db.doCreateUser(usr).then(() => {
//         dispatch(submitUserInfoToDBSuccess(usr));
//       });
//     };
//
//     if (auth.getEmail() !== usr.email) {
//       return auth
//         .doEmailUpdate(usr.email)
//         .then(() => {
//           submitUserDispatchWrapper();
//         })
//         .catch((error) => {
//           console.log('error', error.message);
//           dispatch(errorSubmitUser(error.message));
//         });
//     }
//
//     const { passwordOne, passwordTwo } = userData;
//     if (passwordOne || passwordTwo) {
//       if (passwordOne === passwordTwo) {
//         return auth
//           .doPasswordUpdate(userData.passwordOne)
//           .then(() => {
//             submitUserDispatchWrapper();
//           })
//           .catch((error) => {
//             dispatch(errorSubmitUser(error.message));
//           });
//       }
//       return dispatch(errorSubmitUser('Passwords are not matching'));
//     }
//
//     return submitUserDispatchWrapper();
//     // return db
//     //   .getUser(uid)
//     //   .then(usrInfo => {
//     //     dispatch(setAuthUserInfo(usrInfo));
//     //   })
//     //   .catch(err => console.log('err', err));
//   };
// }
