import {
  RECEIVE_USER_INFO,
  SELECT_CARD_ID,
  EXTEND_CARD_ID,
  EXTEND_USER_INFO,
  SELECT_CARD_TYPE
} from './actions';

import { NO_CARD_FILTER } from 'Constants/cardFields';

const INITIAL_STATE = {
  selectedCardID: null,
  // cardSets: [],
  // cards: [],
  // createdCards: [],
  // submittedCards: [],
  modalActive: false,
  extendedCardID: null,
  userInfoExtended: false,
  selectedCardType: NO_CARD_FILTER,
};

function reducer(state = INITIAL_STATE, action) {
  // console.log('action', action);
  // const { selectedCardId } = state;

  switch (action.type) {
    case SELECT_CARD_ID: {
      const selectedCardID = action.options;
      return { ...state, selectedCardID };
    }
    case SELECT_CARD_TYPE: {
      const selectedCardType = action.options;
      return {
        ...state,
        selectedCardType,
        selectedCardType
      };
    }
    case EXTEND_USER_INFO: {
      return { ...state, userInfoExtended: !state.userInfoExtended };
    }
    case EXTEND_CARD_ID: {
      const extendedCardId = action.options;
      return { ...state, extendedCardId };
    }
    case RECEIVE_USER_INFO: {
      const userInfo = action.options;
      return { ...state, ...userInfo };
    }
    default:
      return state;
  }
}

export default reducer;
