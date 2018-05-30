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
  TOGGLE_TAG_LIST,
  TOGGLE_GRID_VIEW,
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

const cardTemplateId = 'temp';
function reducer(state = {}, action) {
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
    case CHANGE_VIEWPORT: {
      // const cards = action.options;

      return {
        ...state
        // cards
        // isCardDragging
      };
    }

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
    case TOGGLE_TAG_LIST: {
      return { ...state, tagListView: !state.tagListView, gridView: false };
    }
    // case FILTER_CARDS: {
    //   // console.log('action', action);
    //   const selectedTags = action.options;
    //   // if (selectedTags.length === 0)
    //   //   return { ...state, cards: state.defaultCards };
    //   // TODO: fix filtering
    //   const cards = state.cards.filter(
    //     c =>
    //       selectedTags.length === 0 ||
    //       intersection(c.tags, selectedTags).length > 0
    //   );
    //   console.log('cards', cards);
    //   return { ...state, cards, selectedTags };
    // }
    // case RECEIVE_PLACES: {
    //   const { results: places } = action.options;
    //   // console.log('places', places);
    //   const placeCards = places.map(
    //     ({
    //       id,
    //       geometry: {
    //         location: { lat: latitude, lng: longitude }
    //       },
    //       types: tags,
    //       name: title
    //     }) => ({
    //       id,
    //       loc: { latitude, longitude },
    //       tags,
    //       title,
    //       challenge: { type: null },
    //       media: []
    //     })
    //   );
    //   // console.log('cardPlaces', placeCards);
    //   const newCards = [...state.cards, ...placeCards];
    //   return { ...state, cards: newCards, defaultCards: newCards };
    // }
    // case TOGGLE_TSNE_VIEW: {
    //   return { ...state, tsneView: !state.tsneView };
    // }
    // case TOGGLE_GRID_VIEW: {
    //   const { selectedCardId } = state;
    //   const gridView = !state.gridView;
    //
    //   const { width, height, zoom, latitude, longitude } = state;
    //   const vp = new PerspectiveMercatorViewport({
    //     width,
    //     height,
    //     zoom,
    //     latitude,
    //     longitude
    //   });
    //
    //   // TODO
    //   const [bottomLng, bottomLat] = gridView
    //     ? vp.unproject([width / 2, height * 1 / 4])
    //     : vp.unproject([width / 2, height * 3 / 4]);
    //
    //   return {
    //     ...state,
    //     gridView,
    //     tagListView: false,
    //     longitude: bottomLng,
    //     latitude: bottomLat,
    //     selectedCardId: !gridView
    //       ? null
    //       : selectedCardId || state.cacheSelectedCardId,
    //     cacheSelectedCardId: selectedCardId
    //   };
    // }
    // case LOAD_DIRECTION: {
    //   return { ...state, directionLoading: true };
    // }
    // case RETRIEVE_DIRECTION: {
    //   const direction = action.options;
    //   const bbox = getBoundingBox(direction.routes[0].geometry.coordinates);
    //   // bbox.forEach(a => (a[1] += state.latCenterOffset));
    //
    //   const { width, height, latitude, longitude, zoom } = state;
    //   const vp = new PerspectiveMercatorViewport({
    //     width,
    //     height,
    //     zoom,
    //     latitude,
    //     longitude
    //   }).fitBounds(bbox, {
    //     padding: 20,
    //     offset: [0, height / 4]
    //   });
    //
    //   const [bottomLng, bottomLat] = vp.unproject([width / 2, height / 3]);
    //
    //   const { zoom: minZoom } = vp;
    //
    //   return {
    //     ...state,
    //     direction,
    //     latitude: bottomLat, // latitude + 0.0135,
    //     longitude: bottomLng,
    //     zoom: minZoom,
    //     directionLoading: false
    //     // height: state.height - 200
    //   };
    // }
    // case FLY_TO_USER: {
    //   const { width, height, zoom, userLocation } = state;
    //   const mapViewport = offsetMapViewport({
    //     width,
    //     height,
    //     zoom: 18,
    //     ...userLocation
    //   });
    //
    //   return {
    //     ...state,
    //     ...mapViewport,
    //     userSelected: true
    //     // mapZoom: 12 // state.defaultZoom
    //   };
    // }
    case RESIZE_CARD_WINDOW: {
      return { ...state, ...action };
    }

    case CHANGE_MAP_VIEWPORT: {
      const mapViewport = action.options;
      return { ...state, mapViewport };
    }

    case SCREEN_RESIZE: {
      const height = action.options.height;
      const width = action.options.width;
      const newState = {
        height,
        width
      };
      return { ...state, ...newState };
    }

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
        ...centerLocation,
        userLocation
      };
    }
    default:
      return state;
  }
}

export default reducer;
