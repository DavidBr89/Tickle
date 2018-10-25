import {
  setAuthUser,
  setAuthUserInfo,
  submitUserInfoToDBSuccess,
  errorSubmitUser,
} from './actions';

import {createDbEnv, auth} from 'Firebase';

import {userFields} from 'Constants/userFields';

export function fetchUserInfo(uid) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.
  return function(dispatch, getState) {
    if (uid === null) return dispatch(setAuthUserInfo({uid: null}));

    dispatch(setAuthUserInfo({uid}));

    // console.log('CALL WITH uid', uid);
    const db = createDbEnv(getState());
    return db
      .getUser(uid)
      .then(usrInfo => {
        console.log('retrieve USR INFO', usrInfo);
        dispatch(setAuthUserInfo(userFields({uid, ...usrInfo})));
      })
      .catch(err => console.log('err', err));
  };
}

export function setUserEnvList(envList) {
  console.log('envList', envList);
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.
  return function(dispatch, getState) {
    // console.log('CALL WITH uid', uid);
    const db = createDbEnv(getState());
    const {authUser} = getState().Session;

    const {userEnvs: oldEnvList} = authUser;
    const updatedUser = {...authUser, userEnvs: envList};

    return db
      .doUpdateUser(updatedUser)
      .then(usrInfo => {
        console.log('retrieve USR INFO', usrInfo);
        dispatch(setAuthUserInfo(userFields(updatedUser)));
      })
      .catch(err => console.log('err', err));
  };
}

export function updateAuthUserInfo({...usrProfile}) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.
  return function(dispatch, getState) {
    // console.log('CALL WITH uid', uid);
    const db = createDbEnv(getState());
    const {authUser} = getState().Session;

    const updatedUser = {...authUser, usrProfile};
    return db
      .updateUser()
      .then(usrInfo => {
        console.log('retrieve USR INFO', usrInfo);
        dispatch(setAuthUserInfo(userFields(updatedUser)));
      })
      .catch(err => console.log('err', err));
  };
}

export function submitUserInfoToDB(userData) {
  return function(dispatch) {
    // dispatch(setAuthUserInfo(userInfo));

    const usr = userFields(userData);
    const submitUserDispatchWrapper = () => {
      const {file, uid} = userData;
      if (file) {
        return db
          .addImgToStorage({file, path: 'usr', id: uid})
          .then(photoURL => {
            const newUsr = {...usr, photoURL};
            db.doCreateUser(newUsr).then(() => {
              dispatch(submitUserInfoToDBSuccess(newUsr));
            });
          });
      }
      return db.doCreateUser(usr).then(() => {
        dispatch(submitUserInfoToDBSuccess(usr));
      });
    };

    if (auth.getEmail() !== usr.email) {
      return auth
        .doEmailUpdate(usr.email)
        .then(() => {
          submitUserDispatchWrapper();
        })
        .catch(error => {
          console.log('error', error.message);
          dispatch(errorSubmitUser(error.message));
        });
    }

    const {passwordOne, passwordTwo} = userData;
    if (passwordOne || passwordTwo) {
      if (passwordOne === passwordTwo) {
        return auth
          .doPasswordUpdate(userData.passwordOne)
          .then(() => {
            submitUserDispatchWrapper();
          })
          .catch(error => {
            dispatch(errorSubmitUser(error.message));
          });
      }
      return dispatch(errorSubmitUser('Passwords are not matching'));
    }

    return submitUserDispatchWrapper();
    // return db
    //   .getUser(uid)
    //   .then(usrInfo => {
    //     dispatch(setAuthUserInfo(usrInfo));
    //   })
    //   .catch(err => console.log('err', err));
  };
}
