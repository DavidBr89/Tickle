import { union, difference } from 'lodash';
import {
  TOGGLE_DATA_VIEW,
  ADD_CARD_FILTER,
  REMOVE_CARD_FILTER,
  FILTER_CARDS
} from './actions';

const INITIAL_STATE = {
  dataView: 'topic',
  authEnv: true
};

export default function dataViewReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TOGGLE_DATA_VIEW: {
      return { ...state, dataView: action.options };
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

    // case 'FILTER': {
    //   const filterSet = action.options;
    //   return {
    //     ...state,
    //     filterSet
    //   };
    // }
    default:
      return state;
  }
}
