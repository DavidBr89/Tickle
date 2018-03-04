// import { combineReducers } from 'redux';
// import cards from './cards';
// import visibilityFilter from './visibilityFilter';
import {
  WebMercatorViewport,
  PerspectiveMercatorViewport
} from 'viewport-mercator-project';

import setBBox from './fitbounds';
import mapboxgl from 'mapbox-gl';

import {
  SELECT_CARD,
  RESIZE_CARD_WINDOW,
  USER_MOVE,
  CHANGE_MAP_VIEWPORT,
  SCREEN_RESIZE,
  PLAY_CARD_CHALLENGE,
  TOGGLE_CARD_CHALLENGE,
  EXTEND_SELECTED_CARD,
  FLY_TO_USER
} from './actions';

import { RETRIEVE_DIRECTION } from './async_actions';

function getBoundingBox(data) {
  const bounds = {};
  let latitude;
  let longitude;

  // for (var i = 0; i < data.features.length; i++) {
  const coords = data.coordinates;

  for (let j = 0; j < coords.length; j++) {
    longitude = coords[j][0];
    latitude = coords[j][1];
    bounds.lngMin = bounds.lngMin < longitude ? bounds.lngMin : longitude;
    bounds.lngMax = bounds.lngMax > longitude ? bounds.lngMax : longitude;
    bounds.latMin = bounds.latMin < latitude ? bounds.latMin : latitude;
    bounds.latMax = bounds.latMax > latitude ? bounds.latMax : latitude;
  }
  // }
  return [[bounds.lngMin, bounds.latMin], [bounds.lngMax, bounds.latMax]];
}

// function getPolygonBoundingBox(feature) {
//   // bounds [xMin, yMin][xMax, yMax]
//   const bounds = [[], []];
//   let polygon;
//   let latitude;
//   let longitude;
//
//   for (let i = 0; i < feature.geometry.coordinates.length; i++) {
//     if (feature.geometry.coordinates.length === 1) {
//       // Polygon coordinates[0][nodes]
//       polygon = feature.geometry.coordinates[0];
//     } else {
//       // Polygon coordinates[poly][0][nodes]
//       polygon = feature.geometry.coordinates[i][0];
//     }
//
//     for (let j = 0; j < polygon.length; j++) {
//       longitude = polygon[j][0];
//       latitude = polygon[j][1];
//
//       bounds[0][0] = bounds[0][0] < longitude ? bounds[0][0] : longitude;
//       bounds[1][0] = bounds[1][0] > longitude ? bounds[1][0] : longitude;
//       bounds[0][1] = bounds[0][1] < latitude ? bounds[0][1] : latitude;
//       bounds[1][1] = bounds[1][1] > latitude ? bounds[1][1] : latitude;
//     }
//   }
//
//   return bounds;
// }
// const mapViewApp = combineReducers({
//   cards,
//   visibilityFilter
// });
//
// export default mapViewApp;

function reducer(state = {}, action) {
  // console.log('action', action);
  switch (action.type) {
    case RETRIEVE_DIRECTION: {
      const direction = action.options;
      const bbox = getBoundingBox(direction.routes[0].geometry);
      // bbox.forEach(a => (a[1] += state.latOffset));

      const { latitude, longitude, zoom } = new PerspectiveMercatorViewport({
        width: state.width,
        height: state.height
        // latitude: state.latitude,
        // longitude: state.longitude
      }).fitBounds(bbox, {
        padding: 20,
        offset: [-100, 200]
      });

      // const { latitude, longitude, zoom } = setBBox(
      //   { width: state.width, height: state.height },
      //   bbox,
      //   { padding: 40 }
      // );

      return {
        ...state,
        direction,
        latitude,
        longitude,
        zoom
      };
    }
    // case FLY_TO_USER: {
    //   return {
    //     ...state
    //     // centerLocation: state.userLocation,
    //     // mapZoom: 12 // state.defaultZoom
    //   };
    // }
    case RESIZE_CARD_WINDOW: {
      return { ...state, ...action };
    }
    case CHANGE_MAP_VIEWPORT: {
      // if (state.extCardId !== null) return state;
      const viewport = action.options;
      console.log('viewport', viewport);
      // const mapHeight = viewport.height;
      // const width = viewport.width;
      const zoom = viewport.zoom;

      return {
        ...state,
        // mapHeight,
        // width,
        zoom
      };
    }
    // case PLAY_CARD_CHALLENGE:
    //   return Object.assign({}, state, {
    //   todos: [
    //       ...state.todos,
    //       {
    //         text: action.text,
    //         completed: false
    //       }
    //     ]
    // });
    case SELECT_CARD: {
      const selectedCardId = action.options;
      const selectedCard = state.cards.find(d => d.id === selectedCardId);

      const { longitude, latitude } =
        selectedCardId !== null
          ? { ...selectedCard.loc }
          : { ...state.userLocation };
      // console.log('selectedCard', selectedCard);

      const mapViewport = {
        zoom: selectedCardId ? 15 : state.zoom,
        latitude: latitude + state.latOffset,
        longitude
      };
      return { ...state, ...mapViewport, direction: null, selectedCardId };
    }

    case EXTEND_SELECTED_CARD: {
      const extCardId = action.options;
      // console.log('extCardId', extCardId);
      return { ...state, extCardId };
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

    case TOGGLE_CARD_CHALLENGE: {
      const { cardChallengeOpen } = action.options;
      return {
        ...state,
        cardChallengeOpen
      };
    }

    case PLAY_CARD_CHALLENGE: {
      return {
        ...state,
        modalOpen: !state.modalOpen
      };
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
