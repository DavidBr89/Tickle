// import { combineReducers } from 'redux';
// import cards from './cards';
// import visibilityFilter from './visibilityFilter';
import {
  // WebMercatorViewport,
  PerspectiveMercatorViewport
} from 'viewport-mercator-project';

// import setBBox from './fitbounds';
// import mapboxgl from 'mapbox-gl';

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

import { RETRIEVE_DIRECTION, LOAD_DIRECTION } from './async_actions';

const focusLoc = ({ width, height, zoom, latitude, longitude }) => {
  const vp = new PerspectiveMercatorViewport({
    width,
    height,
    zoom,
    latitude,
    longitude
  });
  const [bottomLng, bottomLat] = vp.unproject([width / 2, height / 3]);

  const mapViewport = {
    zoom: vp.zoom,
    latitude: bottomLat,
    longitude: bottomLng
  };
  return mapViewport;
};

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

function reducer(state = {}, action) {
  // console.log('action', action);
  switch (action.type) {
    case LOAD_DIRECTION: {
      return { ...state, directionLoading: true };
    }
    case RETRIEVE_DIRECTION: {
      const direction = action.options;
      const bbox = getBoundingBox(direction.routes[0].geometry);
      // bbox.forEach(a => (a[1] += state.latCenterOffset));

      const { width, height, latitude, longitude, zoom } = state;
      const vp = new PerspectiveMercatorViewport({
        width,
        height,
        zoom,
        latitude,
        longitude
      }).fitBounds(bbox, {
        padding: 50,
        offset: [0, 130]
      });

      const [bottomLng, bottomLat] = vp.unproject([width / 2, height / 3]);

      const { zoom: newZoom } = vp;

      return {
        ...state,
        direction,
        latitude: bottomLat, // latitude + 0.0135,
        longitude: bottomLng,
        zoom: newZoom,
        directionLoading: false
        // height: state.height - 200
      };
    }
    case FLY_TO_USER: {
      const { width, height, zoom, userLocation } = state;
      const mapViewport = focusLoc({
        width,
        height,
        zoom: 18,
        ...userLocation
      });

      return {
        ...state,
        ...mapViewport,
        userSelected: true
        // mapZoom: 12 // state.defaultZoom
      };
    }
    case RESIZE_CARD_WINDOW: {
      return { ...state, ...action };
    }
    case CHANGE_MAP_VIEWPORT: {
      // if (state.extCardId !== null) return state;
      const viewport = action.options;
      console.log('viewport', viewport);
      // const mapHeight = viewport.height;
      // const width = viewport.width;
      const { zoom, latitude, longitude } = viewport;

      return {
        ...state,
        latitude,
        longitude,
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
      const { width, height } = state;

      const { longitude, latitude } =
        selectedCardId !== null
          ? { ...selectedCard.loc }
          : { ...state.userLocation };

      const mapViewport = focusLoc({
        width,
        height,
        longitude,
        latitude,
        zoom: 15
      });

      return {
        ...state,
        ...mapViewport,
        direction: null,
        selectedCardId,
        userSelected: false
      };
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
