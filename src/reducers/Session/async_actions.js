import {
  setAuthUser,
  setAuthUserInfo,
  submitUserInfoToDBSuccess
} from './actions';

import { db } from 'Firebase';
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

        console.log('userDetails', userDetails);
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
    console.log('dispatch userInfo', userInfo);
    // dispatch(setAuthUserInfo(userInfo));

    const usr = userFields(userInfo);
    db.doCreateUser(usr).then(() => {
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
