// import { combineReducers } from 'redux';
// import cards from './cards';
// import visibilityFilter from './visibilityFilter';
// import turf from 'turf';
// import booleanWithin from '@turf/boolean-within';
import {
  // WebMercatorViewport,
  PerspectiveMercatorViewport
} from 'viewport-mercator-project';

import { scaleLinear, extent, geoMercator } from 'd3';
// import { getBoundingBox } from './utils';
import { intersection } from 'lodash';

import { db } from 'Firebase';

// import setBBox from './fitbounds';
// import mapboxgl from 'mapbox-gl';

import {
  SELECT_CARD,
  RESIZE_CARD_WINDOW,
  USER_MOVE,
  SCREEN_RESIZE,
  // FLY_TO_USER,
  // TOGGLE_TAG_LIST,
  // TOGGLE_GRID_VIEW,
  // RECEIVE_PLACES,
  // RECEIVE_CARDS,
  CHANGE_VIEWPORT,
  // RECEIVE_AUTHORED_CARDS,
  // CREATE_CARD,
  CHANGE_MAP_VIEWPORT
} from './actions';

import {
  // RETRIEVE_DIRECTION,
  LOAD_DIRECTION
  // GET_TOPIC_MAP
} from './async_actions';

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

const defaultLocation = {
  latitude: 50.85146,
  longitude: 4.315483
};
// const cardTemplateId = 'temp';
const INITIAL_STATE = {
  mapViewport: {
    zoom: 15,
    ...defaultLocation
  },
  accessibleRadius: 50,
  userLocation: defaultLocation
};
function reducer(state = INITIAL_STATE, action) {
  // console.log('action', action);
  // const { selectedCardId } = state;

  switch (action.type) {
    case CHANGE_MAP_VIEWPORT: {
      const mapViewport = action.options;
      return {
        ...state,
        mapViewport: { ...state.mapViewport, ...mapViewport }
      };
    }

    // case SCREEN_RESIZE: {
    //   const { width, height } = action.options;
    //   console.log('SCREEN_RESIZE', width, height);
    //   return { ...state, width, height };
    // }

    case USER_MOVE: {
      const userLocation = action.options;
      return {
        ...state,
        userLocation
        // userLocation
      };
    }
    default:
      return state;
  }
}

export default reducer;
