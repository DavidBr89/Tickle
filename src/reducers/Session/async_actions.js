import {uniqBy} from 'lodash';

import {
  setAuthUser,
  setAuthUserInfo,
  submitUserInfoToDBSuccess,
  errorSubmitUser,
  setUserEnvSelection
} from './actions';

import {createDbEnv, DB, auth} from 'Firebase';

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

export function signUp({user, password, img, userEnv}) {
  const {email} = user;

  return dispatch => {
    const db = DB(userEnv);

    const createUser = profile =>
      db.doCreateUser(profile).then(() => {
        dispatch(setUserEnvSelection(userEnv));
        dispatch(setAuthUserInfo({authUser: profile}));
      });

    return auth.doCreateUserWithEmailAndPassword(email, password).then(res => {
      const {uid} = res.user;
      // setAuthUser({authUser: user});

      if (img !== null) {
        return db
          .addImgToStorage({file: img.file, path: `usr/${uid}`})
          .then(imgUrl => {
            const userAndImg = {...user, uid, photoURL: imgUrl};

            createUser(userAndImg);
          })
          .catch(error => {
            this.setState({error, loading: false});
          });
      }
      console.log('user to add', user);
      return createUser({...user, uid});
    });
  };
}

export const signIn = ({
  email,
  password,
  userEnv,
  onSuccess = d => d,
  onError = d => d
}) => (dispatch, getState) => {
  const db = DB(userEnv);
  return auth.doSignInWithEmailAndPassword(email, password).then(resp => {
    console.log('response', resp);
    const {user} = resp;
    const {uid} = user;

    return db.getUser(uid).then(usrInfo => {
      dispatch(setAuthUserInfo(userFields({uid, ...usrInfo})));
      dispatch(setUserEnvSelection(userEnv));
      return usrInfo;
    });
    // .catch(err => {
    //   console.log('login Err', err);
    //
    //   onError(err.message);
    // });
  });
  // .catch(error => {
  //   console.log('response failure', error);
  //   return onError(error.message);
  // });
};

export function removeUserEnv(env) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.
  return function(dispatch, getState) {
    // console.log('CALL WITH uid', uid);
    const db = createDbEnv(getState());
    const {authUser} = getState().Session;
    const {userEnvs, uid} = authUser;

    const updatedUserEnv = {userEnvs: userEnvs.filter(u => u.id !== env.id)};

    return db
      .removeUserEnv({uid, envId: env.id})
      .then(usrInfo => {
        console.log('retrieve USR INFO', usrInfo);
        dispatch(setAuthUserInfo(updatedUserEnv));
      })
      .catch(err => console.log('err', err));
  };
}

export function addUserEnv(env) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.
  return function(dispatch, getState) {
    // console.log('CALL WITH uid', uid);
    const db = createDbEnv(getState());
    const {authUser} = getState().Session;
    const {uid} = authUser;

    const {userEnvs} = authUser;

    const updatedUser = {userEnvs: uniqBy([...userEnvs, env], 'id')};

    return db
      .addUserEnv({uid, env})
      .then(usrInfo => {
        console.log('retrieve USR INFO', usrInfo);
        dispatch(setAuthUserInfo(updatedUser));
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

export function selectUserEnv(env) {
  return function(dispatch, getState) {
    const db = createDbEnv(getState());
    const {
      authUser: {userEnvs}
    } = getState().Session;
    const newUserEnvs = userEnvs.map(u => ({...u, selected: u.id === env.id}));

    const {authUser} = getState().Session;
    const {uid} = authUser;

    dispatch(setUserEnvSelection(env.id));
    return db
      .addUserEnv({uid, env})
      .then(usrInfo => {
        console.log('retrieve USR INFO', usrInfo);
        dispatch(setAuthUserInfo({userEnvs: newUserEnvs}));
      })
      .catch(err => console.log('err', err));
  };
}

export function submitUserInfoToDB(userData) {
  return function(dispatch, getState) {
    const db = createDbEnv(getState());
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
