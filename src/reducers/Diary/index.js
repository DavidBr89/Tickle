import {
  RECEIVE_USER_INFO,
  SELECT_CARD_ID,
  EXTEND_CARD_ID,
  EXTEND_USER_INFO,
  SELECT_CARD_TYPE
} from './actions';

import { NO_CARD_FILTER, challengeTypeMap } from 'Constants/cardFields';

const INITIAL_STATE = {
  // skills: [],
  // collectedCards: [],
  // createdCards: [],
  // submittedCards: [],
  // numCollectedCards: 0,
  // numCreatedCards: 0,
  cardSets: [],
  cards: [],
  createdCards: [],
  submittedCards: [],
  modalActive: false,
  selectedCardId: null,
  extendedCardId: null,
  userInfoExtended: false,
  filterByCardType: challengeTypeMap[NO_CARD_FILTER]
};

function reducer(state = INITIAL_STATE, action) {
  // console.log('action', action);
  // const { selectedCardId } = state;

  switch (action.type) {
    case SELECT_CARD_TYPE: {
      const selectedCardType = action.options;
      return { ...state, filterByCardType: challengeTypeMap[selectedCardType] };
    }
    case SELECT_CARD_ID: {
      const selectedCardId = action.options;
      return { ...state, selectedCardId };
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
