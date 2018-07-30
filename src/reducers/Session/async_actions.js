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
  };
}

export function submitUserInfoToDB(userInfo) {
  return function(dispatch) {
    // dispatch(setAuthUserInfo(userInfo));

    console.log('userInfo', userInfo);
    const usr = userFields(userInfo);
    if (auth.getEmail() !== usr.email) {
      return auth
        .doEmailUpdate(usr.email)
        .then(() => {
          db.doCreateUser(usr).then(() => {
            dispatch(submitUserInfoToDBSuccess(usr));
          });
        })
        .catch(error => {
          console.log('error', error.message);
          dispatch(errorSubmitUser(error.message));
        });
    }

    const { passwordOne, passwordTwo } = userInfo;
    if (passwordOne || passwordTwo) {
      if (passwordOne === passwordTwo) {
        return auth
          .doPasswordUpdate(userInfo.passwordOne)
          .then(() => {
            db.doCreateUser(usr).then(() => {
              dispatch(submitUserInfoToDBSuccess(usr));
            });
          })
          .catch(error => {
            dispatch(errorSubmitUser(error.message));
          });
      }
      return dispatch(errorSubmitUser('Passwords are not matching'));
    }

    return db.doCreateUser(usr).then(() => {
      dispatch(submitUserInfoToDBSuccess(usr));
    });

    // return db
    //   .getUser(uid)
    //   .then(usrInfo => {
    //     dispatch(setAuthUserInfo(usrInfo));
    //   })
    //   .catch(err => console.log('err', err));
  };
}
