// import { combineReducers } from 'redux';
// import cards from './cards';
// import visibilityFilter from './visibilityFilter';
// import turf from 'turf';
// import booleanWithin from '@turf/boolean-within';

// import setBBox from './fitbounds';
// import mapboxgl from 'mapbox-gl';

import { SCREEN_RESIZE } from './actions';

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
const INITIAL_STATE = { width: 100, height: 100 };
function reducer(state = INITIAL_STATE, action) {
  // console.log('action', action);
  // const { selectedCardId } = state;

  switch (action.type) {
    case SCREEN_RESIZE: {
      const { width, height } = action.options;
      return { ...state, width, height };
    }
    default:
      return state;
  }
}

export default reducer;
