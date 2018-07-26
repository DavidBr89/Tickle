import { AUTH_USER_SET, SET_AUTH_USER_INFO } from './actions';

const INITIAL_STATE = {
  authUser: null
};

function sessionReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTH_USER_SET: {
      const { options } = action;
      return { ...state, ...options };
    }
    case SET_AUTH_USER_INFO: {
      const { options } = action;
      return { ...state, authUser: { ...state.authUser, ...options } };
    }
    default:
      return state;
  }
}

export default sessionReducer;
