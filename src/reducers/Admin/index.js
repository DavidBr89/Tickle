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
  EXTEND_SELECTION,
  SUBMIT_CHALLENGE_REVIEW,
  CARD_FILTER_CHANGE,
  FLIP
} from './actions';

import {
  CHALLENGE_STARTED,
  CHALLENGE_SUCCEEDED,
  CHALLENGE_SUBMITTED
} from 'Constants/cardFields';

const INITIAL_STATE = {
  users: [],
  cards: [],
  extendedId: null,
  selectedCardId: null,
  selectedUserId: null,//'fq3CsS5YBVOuX3JCyLtzqwLaj5G2',
  cardFilters: [CHALLENGE_STARTED, CHALLENGE_SUCCEEDED, CHALLENGE_SUBMITTED],
  flipped: false
};

function reducer(state = INITIAL_STATE, action) {
  // console.log('action', action);
  // const { selectedCardId } = state;

  switch (action.type) {
    case FLIP: {
      const flipped = action.options;
      return { ...state, flipped };
    }
    case CARD_FILTER_CHANGE: {
      const cardFilters = action.options;
      return { ...state, cardFilters };
    }
    case RECEIVE_USERS: {
      const users = action.options;
      return { ...state, users };
    }
    case GET_CARDS: {
      const cards = action.options;
      return { ...state, cards };
    }
    case SUBMIT_CHALLENGE_REVIEW: {
      const challengeSubmission = action.options;
      const { cards } = state;
      console.log('Cards', cards);
      const { cardId } = challengeSubmission;

      const newCards = cards.map(c => {
        if (c.id === cardId) {
          return {
            ...c,
            allChallengeSubmissions: [
              challengeSubmission,
              ...c.allChallengeSubmissions
            ]
          };
        }
        return c;
      });

      return { ...state, cards: newCards };
    }
    case SELECT_USER: {
      const selectedUserId = action.options;
      return { ...state, selectedUserId, selectedCardId: null };
    }
    case SELECT_CARD_ID: {
      const selectedCardId = action.options;
      // console.log('selectedCardId OPTS', selectedCardId);
      return { ...state, selectedCardId };
    }
    case EXTEND_SELECTION: {
      const extendedId = action.options;
      const { flipped } = state;
      return {
        ...state,
        extendedId,
        flipped: extendedId === null ? null : flipped
      };
    }
    default:
      return state;
  }
}

export default reducer;
