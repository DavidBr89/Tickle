import { setAuthUser, setAuthUserInfo } from './actions';

import { db } from 'Firebase';

export function fetchUserInfo(uid) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.
  console.log('yeah');
  return function(dispatch) {
    // TODO: change later
    console.log('disp set', uid);
    return db
      .getUserInfo(uid)
      .then(usrInfo => {
        console.log('usrInfo', usrInfo);
        dispatch(setAuthUserInfo({ uid, ...usrInfo }));
      })
      .catch(err => console.log('err', err));
  };
}
