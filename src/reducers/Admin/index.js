// import { combineReducers } from 'redux';
// import cards from './cards';
// import visibilityFilter from './visibilityFilter';
// import turf from 'turf';
// import booleanWithin from '@turf/boolean-within';

// import setBBox from './fitbounds';
// import mapboxgl from 'mapbox-gl';

import { RECEIVE_USERS, GET_CARDS } from './actions';

// const toGeoJSON = points => ({
//   type: 'FeatureCollection',
//   features: points.map(p => ({
//     type: 'Feature',
//     geometry: {
//       type: 'Point',
//       coordinates: p
//     }
//   }))
// });
const INITIAL_STATE = { users: [], cards: [] };
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
    default:
      return state;
  }
}

export default reducer;
