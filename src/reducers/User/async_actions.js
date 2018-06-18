import {setUsers} from './actions';

import { db } from 'Firebase';

export function fetchReadableCards(uid) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.
  return function(dispatch) {
    // TODO: change later
    return db.getUsers(uid, 'createdCards').then(data => {
      dispatch(setUsers(data));
    });
  };
}
