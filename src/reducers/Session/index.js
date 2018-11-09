import { DB } from 'Firebase';

import {
  AUTH_USER_SET,
  SET_AUTH_USER_INFO,
  CLEAR_AUTH_USER,
  ERROR_SUBMIT_USER,
  RECEIVE_USER_INFO,
  SELECT_CARD_ID,
  EXTEND_USER_INFO,
  SUBMIT_USER_INFO_TO_DB_SUCCESS,
  SET_USER_ENV
  // SET_DEVICE
} from './actions';

const INITIAL_STATE = {
  authUser: null,
  errorUpdateUserMsg: null,
  cardSets: [],
  cards: [],
  createdCards: [],
  submittedCards: [],
  modalActive: false,
  selectedCardId: null,
  extendedCardId: null,
  userInfoExtended: false,
  device: { smallScreen: false, iOs: false },
  selectedUserEnvId: 'staging'
};

function sessionReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case EXTEND_USER_INFO: {
      return { ...state, userInfoExtended: !state.userInfoExtended };
    }
    case RECEIVE_USER_INFO: {
      const userInfo = action.options;
      return { ...state, ...userInfo };
    }
    case AUTH_USER_SET: {
      const { options } = action;
      return { ...state, ...options };
    }

    case CLEAR_AUTH_USER: {
      return { ...state, authUser: null };
    }
    case SET_AUTH_USER_INFO: {
      const { options } = action;
      return { ...state, authUser: { ...state.authUser, ...options } };
    }
    case ERROR_SUBMIT_USER: {
      const { options } = action;
      return { ...state, errorUpdateUserMsg: options };
    }
    case SET_USER_ENV: {
      const { options: selectedUserEnvId } = action;

      return { ...state, selectedUserEnvId };
    }
    case SUBMIT_USER_INFO_TO_DB_SUCCESS: {
      // const { options } = action;
      return { ...state, userInfoExtended: false, errorUpdateUserMsg: null };
    }
    default:
      return state;
  }
}

export default sessionReducer;
