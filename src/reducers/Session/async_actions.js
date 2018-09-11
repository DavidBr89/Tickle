import {
  setAuthUser,
  setAuthUserInfo,
  submitUserInfoToDBSuccess,
  errorSubmitUser
} from './actions';

import { db, auth } from 'Firebase';
import setify from 'Utils/setify';

import { userFields } from 'Constants/userFields';

export function fetchUserInfo(uid) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.
  return function(dispatch) {
    dispatch(setAuthUserInfo({ uid }));
    if (uid !== null) {
      return db
        .getDetailedUserInfo(uid)
        .then(usrInfo => {
          const {
            interests,
            createdCards,
            collectedCards,
            ...userDetails
          } = usrInfo;

          const cardSets = setify([...createdCards, ...collectedCards]);

          const numCollectedCards = collectedCards.length;
          const numCreatedCards = createdCards.length;

          const detailInfo = {
            ...userDetails,
            interests,
            cardSets,
            skills: cardSets,
            collectedCards,
            createdCards,
            numCollectedCards,
            numCreatedCards
          };

          dispatch(setAuthUserInfo({ uid, ...detailInfo }));
        })
        .catch(err => console.log('err', err));
    }
  };
}

export function submitUserInfoToDB(userData) {
  return function(dispatch) {
    // dispatch(setAuthUserInfo(userInfo));

    const usr = userFields(userData);
    const submitUserDispatchWrapper = () => {
      const { file, uid } = userData;
      if (file) {
        return db
          .addImgToStorage({ file, path: 'usr', id: uid })
          .then(photoURL => {
            const newUsr = { ...usr, photoURL };
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

    const { passwordOne, passwordTwo } = userData;
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
