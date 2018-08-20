// import { combineReducers } from 'redux';
// import cards from './cards';
// import visibilityFilter from './visibilityFilter';
// import turf from 'turf';
// import booleanWithin from '@turf/boolean-within';

// import setBBox from './fitbounds';
// import mapboxgl from 'mapbox-gl';

import {
  RECEIVE_USERS,
  GET_CARDS,
  TOGGLE_MODAL,
  SELECT_USER,
  SELECT_CARD_ID,
  EXTEND_SELECTION
} from './actions';

const INITIAL_STATE = {
  users: [],
  cards: [],
  extendedId: null,
  selectedCardId: null,
  selectedUserId: 'fq3CsS5YBVOuX3JCyLtzqwLaj5G2'
};

function reducer(state = INITIAL_STATE, action) {
  // console.log('action', action);
  // const { selectedCardId } = state;

  switch (action.type) {
    case RECEIVE_USERS: {
      const users = action.options;
      return { ...state, users };
    }
    case GET_CARDS: {
      const cards = action.options;
      return { ...state, cards };
    }
    case TOGGLE_MODAL: {
      const modalActive = action.options;
      return { ...state, modalActive };
    }
    case SELECT_USER: {
      const selectedUserId = action.options;
      return { ...state, selectedUserId };
    }
    case SELECT_CARD_ID: {
      const selectedCardId = action.options;
      console.log('selectedCardId OPTS', selectedCardId);
      return { ...state, selectedCardId };
    }
    case EXTEND_SELECTION: {
      const extendedId = action.options;
      return { ...state, extendedId };
    }
    default:
      return state;
  }
}

export default reducer;
