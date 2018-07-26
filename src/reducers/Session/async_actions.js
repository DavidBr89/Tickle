import { setAuthUser, setAuthUserInfo } from './actions';

import { db } from 'Firebase';
import setify from 'Utils/setify';

export function fetchUserInfo(uid) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.
  return function(dispatch) {
    return db
      .getDetailedUserInfo(uid)
      .then(usrInfo => {
        const {
          interests: plainInterests,
          createdCards,
          collectedCards,
          ...userDetails
        } = usrInfo;

        const interests = plainInterests.map(key => ({
          key,
          count: 10,
          values: []
        }));

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

export function changeAuthUserInfo(uid, userInfo) {
  return function(dispatch) {
    dispatch(setAuthUserInfo(userInfo));
    console.log('userInfo', userInfo);

    // db.doCreateUser(userInfo).then(() => console.log('user update'));
    // return db
    //   .getUser(uid)
    //   .then(usrInfo => {
    //     dispatch(setAuthUserInfo(usrInfo));
    //   })
    //   .catch(err => console.log('err', err));
  };
}
