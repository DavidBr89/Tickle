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
const cardTemplateId = 'temp';
const INITIAL_STATE = {
  mapViewport: {
    width: 500,
    height: 500,
    zoom: 10,
    ...defaultLocation,
    userLocation: defaultLocation
  }
};
function reducer(state = INITIAL_STATE, action) {
  // console.log('action', action);
  // const { selectedCardId } = state;

  switch (action.type) {
    // case RECEIVE_AUTHORED_CARDS: {
    //   const cards = action.options;
    //   const createdCards = cards.map(c => ({ ...c, edit: true }));
    //
    //   return {
    //     ...state,
    //     createdCards
    //     // cards
    //     // isCardDragging
    //   };
    // }

    // case DRAG_CARD: {
    //   const isCardDragging = action.options;
    //   return {
    //     ...state,
    //     isCardDragging
    //   };
    // }
    // case TOGGLE_SEARCH: {
    //   const isSearching = action.options;
    //   return {
    //     ...state,
    //     isSearching,
    //     selectedCardId: !isSearching ? state.selectedCardId : null,
    //     selectedCardIdCache: state.selectedCardId
    //   };
    // }
    // case TOGGLE_TAG_LIST: {
    //   return { ...state, tagListView: !state.tagListView, gridView: false };
    // }
    // case RESIZE_CARD_WINDOW: {
    //   return { ...state, ...action };
    // }

    case CHANGE_MAP_VIEWPORT: {
      const mapViewport = action.options;
      return { ...state, mapViewport };
    }

    // case SCREEN_RESIZE: {
    //   const { width, height } = action.options;
    //   console.log('SCREEN_RESIZE', width, height);
    //   return { ...state, width, height };
    // }

    case USER_MOVE: {
      const options = action.options;
      // if (state.extCardId !== null) return state;
      const centerLocation = {
        longitude: options.lngLat[0],
        latitude: options.lngLat[1]
      };
      const userLocation = { ...centerLocation };
      return {
        ...state,
        ...centerLocation
        // userLocation
      };
    }
    default:
      return state;
  }
}

export default reducer;
