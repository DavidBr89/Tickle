import {union, difference, uniq} from 'lodash';

import {TEMPLATE_ID} from 'Constants/cardTemplate';

import {CHALLENGE_NOT_SUBMITTED} from 'Constants/cardFields.ts';
import {
  SET_DATA_VIEW,
  TOGGLE_AUTH_ENV,
  SELECT_CARD,
  EXTEND_SELECTED_CARD,
  ADD_CARD_FILTER,
  REMOVE_CARD_FILTER,
  FILTER_CARDS,
  CONCEAL_CARD_STACK,
  EXTEND_CARD_STACK,
  FILTER_BY_CHALLENGE_STATE,
  FLIP_CARD
  // ADD_CARD_FILTER,
  // REMOVE_CARD_FILTER,
  // FILTER_CARDS
} from './actions';

const INITIAL_STATE = {
  // dataView: 'topic',
  // authEnv: false,
  cardStackBottom: false,
  cardStackExtended: false,
  // selectedCardId: null,
  extCard: null,
  filterSet: [],
  clusteredIds: [],
  challengeStateFilter: CHALLENGE_NOT_SUBMITTED
};

export default function dataViewReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_DATA_VIEW: {
      return {...state, dataView: action.options};
    }
    case SELECT_CARD: {
      const selectedCardId = action.options;
      return {
        ...state,
        selectedCardId
      };
    }
    case EXTEND_SELECTED_CARD: {
      // const { selectedCardId } = state;
      const extCardId = action.options;
      // console.log('extCardId', extCardId);
      // TODO: update
      return {...state, extCardId};
    }

    case ADD_CARD_FILTER: {
      const {filterSet} = state;
      const tag = action.options;
      const newFs = uniq([...filterSet, tag]);
      return {
        ...state,
        filterSet: newFs,
        selectedCardId: null
      };
    }

    case REMOVE_CARD_FILTER: {
      const {filterSet} = state;
      const tag = action.options;

      return {
        ...state,
        filterSet: difference(filterSet, [tag]),
        selectedCardId: null
      };
    }

    case FILTER_CARDS: {
      const filterSet = action.options;
      return {
        ...state,
        filterSet,
        selectedCardId: null
      };
    }
    case FLIP_CARD: {
      const cardFlipped = action.options;
      return {...state, cardFlipped};
    }

    case EXTEND_CARD_STACK: {
      return {...state, cardStackExtended: !state.cardStackExtended};
    }

    case CONCEAL_CARD_STACK: {
      return {...state, cardStackBottom: !state.cardStackBottom};
    }

    case FILTER_BY_CHALLENGE_STATE: {
      const challengeStateFilter = action.options;
      return {...state, challengeStateFilter};
    }
    // case ADD_CARD_FILTER: {
    //   const { filterSet } = state;
    //   const set = action.options;
    //
    //   return {
    //     ...state,
    //     filterSet: union(filterSet, set)
    //     // selectedCardId: null
    //   };
    // }
    //
    // case REMOVE_CARD_FILTER: {
    //   const { filterSet } = state;
    //   const set = action.options;
    //
    //   return {
    //     ...state,
    //     filterSet: difference(filterSet, set)
    //     // selectedCardId: null
    //   };
    // }
    //
    // case FILTER_CARDS: {
    //   const filterSet = action.options;
    //   return { ...state, filterSet };
    // }

    // case TOGGLE_AUTH_ENV: {
    //   // const filterSet = action.options;
    //   return {
    //     ...state,
    //     authEnv: !state.authEnv,
    //     selectedCardId: !state.authEnv ? TEMPLATE_ID : null
    //   };
    // }
    default:
      return state;
  }
}
