import {NO_CARD_FILTER} from '~/constants/cardFields';
import {
  RECEIVE_USER_INFO,
  SELECT_CARD_ID,
  EXTEND_TAB,
  EXTEND_USER_INFO,
  SELECT_CARD_TYPE
} from './actions';

const INITIAL_STATE = {
  selectedCardID: null,
  tabExtended: false,
  // cardSets: [],
  // cards: [],
  // createdCards: [],
  // submittedCards: [],
  modalActive: false,
  extendedCardID: null,
  userInfoExtended: false,
  selectedCardType: NO_CARD_FILTER
};

function reducer(state = INITIAL_STATE, action) {
  // console.log('action', action);
  // const { selectedCardId } = state;

  switch (action.type) {
    case EXTEND_TAB: {
      const {tabExtended} = state;
      return {...state, tabExtended: !tabExtended};
    }
    case SELECT_CARD_TYPE: {
      const selectedCardType = action.options;
      return {
        ...state,
        selectedCardType
      };
    }
    default:
      return state;
  }
}

export default reducer;
