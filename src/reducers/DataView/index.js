import { union, difference, uniq} from 'lodash';

import { TEMPLATE_ID } from 'Constants/cardTemplate';

import {
  SET_DATA_VIEW,
  TOGGLE_AUTH_ENV,
  SELECT_CARD,
  EXTEND_SELECTED_CARD,
  ADD_CARD_FILTER,
  REMOVE_CARD_FILTER,
  FILTER_CARDS,
  TOGGLE_CARD_PANEL,
  FILTER_BY_CLUSTER
  // ADD_CARD_FILTER,
  // REMOVE_CARD_FILTER,
  // FILTER_CARDS
} from './actions';

const INITIAL_STATE = {
  // dataView: 'topic',
  // authEnv: false,
  cardPanelVisible: true,
  selectedCardId: null,
  extCard: null,
  filterSet: [],
  clusteredIds: []
};

export default function dataViewReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_DATA_VIEW: {
      return { ...state, dataView: action.options };
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
      return { ...state, extCardId };
    }

    case ADD_CARD_FILTER: {
      const { filterSet } = state;
      const tag = action.options;
      const newFs = uniq([...filterSet, tag]);
      console.log('newFs', newFs);
      return {
        ...state,
        filterSet: newFs,
        selectedCardId: null
      };
    }

    case REMOVE_CARD_FILTER: {
      const { filterSet } = state;
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
    case TOGGLE_CARD_PANEL: {
      return { ...state, cardPanelVisible: !state.cardPanelVisible };
    }

    case FILTER_BY_CLUSTER: {
      const clusteredIds = action.options;
      return { ...state, clusteredIds };
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
