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
  FLY_TO_USER,
  ENABLE_COMPASS,
  TOGGLE_GRID_VIEW,
  TOGGLE_TSNE_VIEW,
  RECEIVE_PLACES
} from './actions';

import {
  RETRIEVE_DIRECTION,
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

function getBoundingBox(coords) {
  const bounds = {};
  let latitude;
  let longitude;

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
    case RECEIVE_PLACES: {
      const { results: places } = action.options;
      console.log('places', places);
      const placeCards = places.map(
        ({
          id,
          geometry: { location: { lat: latitude, lng: longitude } },
          types: tags,
          name: title
        }) => ({
          id,
          loc: { latitude, longitude },
          tags,
          title,
          challenge: { type: null }
        })
      );
      console.log('cardPlaces', placeCards);
      return { ...state, cards: [...placeCards] };
    }
    case TOGGLE_TSNE_VIEW: {
      return { ...state, tsneView: !state.tsneView };
    }
    case TOGGLE_GRID_VIEW: {
      const gridView = !state.gridView;

      const { width, height, zoom, latitude, longitude } = state;
      const vp = new PerspectiveMercatorViewport({
        width,
        height,
        zoom,
        latitude,
        longitude
      });

      // TODO
      const [bottomLng, bottomLat] = gridView
        ? vp.unproject([width / 2, height * 1 / 4])
        : vp.unproject([width / 2, height * 3 / 4]);

      return {
        ...state,
        gridView,
        longitude: bottomLng,
        latitude: bottomLat,
        selectedCardId: !gridView ? null : state.selectedCardId
      };
    }
    case LOAD_DIRECTION: {
      return { ...state, directionLoading: true };
    }
    case RETRIEVE_DIRECTION: {
      const direction = action.options;
      const bbox = getBoundingBox(direction.routes[0].geometry.coordinates);
      // bbox.forEach(a => (a[1] += state.latCenterOffset));

      const { width, height, latitude, longitude, zoom } = state;
      const vp = new PerspectiveMercatorViewport({
        width,
        height,
        zoom,
        latitude,
        longitude
      }).fitBounds(bbox, {
        padding: 20,
        offset: [0, height / 4]
      });

      const [bottomLng, bottomLat] = vp.unproject([width / 2, height / 3]);

      const { zoom: minZoom } = vp;

      return {
        ...state,
        direction,
        latitude: bottomLat, // latitude + 0.0135,
        longitude: bottomLng,
        zoom: minZoom,
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
      const {
        cards,
        selectedCardId,
        userLocation,
        width,
        height,
        gridView
      } = state;
      // if (state.extCardId !== null) return state;
      const { longitude, latitude, zoom } = action.options;
      // const mapHeight = viewport.height;
      // const width = viewport.width;

      // zoom out;
      // if (viewport.zoom < state.zoom) {
      const bbox = getBoundingBox(
        cards
          .map(({ loc }) => [loc.longitude, loc.latitude])
          .concat([[userLocation.longitude, userLocation.latitude]])
      );

      const selCard = cards.find(d => d.id === selectedCardId);
      const { longitude: centerLng, latitude: centerLat } = selCard
        ? selCard.loc
        : { longitude, latitude };

      const vp = (() => {
        const tmpVp = new PerspectiveMercatorViewport({
          width,
          height,
          zoom,
          latitude: centerLat,
          longitude: centerLng
        });
        if (zoom <= 8) {
          return tmpVp.fitBounds(bbox, {
            padding: 10,
            offset: [width / 8, height / 6]
          });
        }
        return tmpVp;
      })();

      const { zoom: minZoom } = vp;
      // TODO understand
      const [bottomLng, bottomLat] = gridView
        ? vp.unproject([width / 2, height * 1 / 4])
        : vp.unproject([width / 2, height * 3 / 4]);

      const birdsEyeView = zoom <= minZoom;
      const { longitude: newLng, latitude: newLat } = (() => {
        if (birdsEyeView)
          return {
            longitude: gridView ? bottomLng : centerLng,
            latitude: gridView ? bottomLat : centerLat
          };
        return { longitude, latitude };
      })();

      return {
        ...state,
        longitude: state.gridView ? bottomLng : newLng,
        latitude: state.gridView ? bottomLat : newLat,
        birdsEyeView,

        // latitude: newLat, // latScale(viewport.zoom),
        zoom: Math.max(minZoom, zoom),
        // selectedCardId: zoom < 10 ? null : state.selectedCardId,
        userChangedMapViewport: true
      };
      // }

      // const { latitude, longitude, zoom } = viewport;
      // return {
      //   ...state,
      //   latitude,
      //   longitude,
      //   zoom,
      //   // selectedCardId: zoom < 10 ? null : state.selectedCardId,
      //   userChangedMapViewport: true
      // };
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
        zoom: 19
      });

      return {
        ...state,
        ...mapViewport,
        direction: null,
        selectedCardId,
        userChangedMapViewport: false,
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
