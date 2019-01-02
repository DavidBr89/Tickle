// import { combineReducers } from 'redux';
// import cards from './cards';
// import visibilityFilter from './visibilityFilter';
// import turf from 'turf';
// import booleanWithin from '@turf/boolean-within';

// import setBBox from './fitbounds';
// import mapboxgl from 'mapbox-gl';

import {
  CHALLENGE_STARTED,
  CHALLENGE_SUCCEEDED,
  CHALLENGE_SUBMITTED,
  CARD_CREATED,
} from 'Constants/cardFields';
import {
  RECEIVE_USERS,
  RECEIVE_ALL_USER_ENVS,
  GET_CARDS,
  TOGGLE_MODAL,
  SELECT_USER,
  SELECT_CARD_ID,
  INSERT_USER_INTO_ENV,
  ADD_USER_ENV,
  EXTEND_SELECTION,
  SUBMIT_CHALLENGE_REVIEW,
  CARD_FILTER_CHANGE,
  RECEIVE_CARDS,
  SELECT_USERS_BY_ENV,
  USER_REGISTRATION_ERROR,
  ADD_USER,
} from './actions';

const INITIAL_STATE = {
  users: [],
  cards: [],
  extendedId: null,
  selectedCardId: null,
  cardFilters: [CHALLENGE_SUBMITTED],
  flipped: false,
  selectedUserId: null,
  userEnvs: [],
  envUserIds: [],
  userRegErr: null,
};

function reducer(state = INITIAL_STATE, action) {
  // console.log('action', action);
  // const {/selectedCardId } = state;

  switch (action.type) {
    case SELECT_USERS_BY_ENV: {
      const envUserIds = action.options;
      return {...state, envUserIds};
    }
    case SELECT_USER: {
      const selectedUserId = action.options;
      return {...state, selectedUserId};
    }
    case CARD_FILTER_CHANGE: {
      const cardFilters = action.options;
      return {...state, cardFilters};
    }
    case RECEIVE_USERS: {
      const users = action.options;
      return {...state, users};
    }
    case ADD_USER: {
      const {users, envUserIds} = state;
      const usr = action.options;
      const {uid} = usr;
      const newEnvUserIds = [...envUserIds, uid];
      return {...state, users: [...users, usr], envUserIds: newEnvUserIds};
    }
    case RECEIVE_CARDS: {
      const cards = action.options;
      return {...state, cards};
    }
    case ADD_USER_ENV: {
      const {userEnvs} = state;
      const newUserEnv = action.options;
      const newUserEnvs = [...userEnvs, newUserEnv];

      return {...state, userEnvs: newUserEnvs};
    }

    case INSERT_USER_INTO_ENV: {
      const {envUserIds} = state;
      const uid = action.options;
      const newEnvUserIds = [...envUserIds, uid];

      return {...state, envUserIds: newEnvUserIds};
    }
    case RECEIVE_ALL_USER_ENVS: {
      const userEnvs = action.options;
      return {...state, userEnvs};
    }
    case GET_CARDS: {
      const cards = action.options;
      return {...state, cards};
    }
    case SUBMIT_CHALLENGE_REVIEW: {
      const challengeSubmission = action.options;
      const {cards} = state;
      // console.log('Cards', cards);
      const {cardId} = challengeSubmission;

      const newCards = cards.map(c => {
        if (c.id === cardId) {
          return {
            ...c,
            allChallengeSubmissions: [
              challengeSubmission,
              ...c.allChallengeSubmissions,
            ],
          };
        }
        return c;
      });

      return {...state, cards: newCards};
    }
    case SELECT_USER: {
      const selectedUserId = action.options;
      return {...state, selectedUserId, selectedCardId: null};
    }
    case SELECT_CARD_ID: {
      const selectedCardId = action.options;
      // console.log('selectedCardId OPTS', selectedCardId);
      return {...state, selectedCardId};
    }
    case USER_REGISTRATION_ERROR: {
      const userRegErr = action.options;
      // console.log('selectedCardId OPTS', selectedCardId);
      return {...state, userRegErr};
    }
    default:
      return state;
  }
}

export default reducer;
