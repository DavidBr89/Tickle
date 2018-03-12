// import { combineReducers } from 'redux';
// import cards from './cards';
// import visibilityFilter from './visibilityFilter';
import turf from 'turf';
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
  ENABLE_COMPASS
} from './actions';

import { RETRIEVE_DIRECTION, LOAD_DIRECTION } from './async_actions';

const toGeoJSON = points => ({
  type: 'FeatureCollection',
  features: points.map(p => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: p
    }
  }))
});

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
    case ENABLE_COMPASS: {
      return { ...state, compass: !state.compass };
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
      const { cards, width, height } = state;
      // if (state.extCardId !== null) return state;
      const { longitude, latitude, zoom } = action.options;
      // const mapHeight = viewport.height;
      // const width = viewport.width;

      // zoom out;
      // if (viewport.zoom < state.zoom) {
      const bbox = getBoundingBox(
        cards.map(({ loc }) => [loc.longitude, loc.latitude])
      );

      const {
        latitude: newLat,
        longitude: newLong,
        zoom: newZoom
      } = new PerspectiveMercatorViewport({
          width,
          height,
          zoom,
          latitude,
          longitude
        }).fitBounds(bbox, {
          padding: 60
        // offset: [0, 130]
        });
      const gJson = toGeoJSON(
        cards.map(c => [c.loc.longitude, c.loc.latitude])
      );
      console.log('gJson', gJson);
      const convertZoomLevelToMercator = zoomLevel =>
        Math.pow(2, 8 + zoomLevel) / 2 / Math.PI;

      const convertZoomLevelFromMercator = zoomLevelInMercator =>
        Math.log(zoomLevelInMercator * 2 * Math.PI) / Math.LN2 - 8;

      console.log('geoJson', gJson);
      const scale = convertZoomLevelToMercator(zoom);
      const d3Proj = geoMercator()
        .scale(scale)
        .center([longitude, latitude])
        // .clipExtent(bbox)
        .translate([width / 2, height / 2])
        .fitSize([width, height], gJson);

      // const z = Math.sqrt(d3Proj.scale()) / 162.975;
      // const scale = 512 * 0.5 / Math.PI * Math.pow(2, zoom);
      // const lngScale = scaleLinear()
      //   .domain([zoom, 15])
      //   .range(extent([viewport.longitude, longitude]));
      //
      // const latScale = scaleLinear()
      //   .domain([15, zoom])
      //   .range(extent([viewport.latitude, latitude]));

      // console.log(lngScale(viewport.zoom));
      // console.log(latScale(viewport.zoom));
      // console.log('turf', turf);
      // const line = turf.lineString(bbox);
      // const point = turf.point([longitude, latitude]);
      // const newLoc = d3Proj.center();
      // console.log('newLoc', newLoc);
      // // const z = convertZoomLevelFromMercator(d3Proj.scale()); //
      //
      // console.log('boolean-contains', booleanWithin);
      return {
        ...state,
        longitude: newZoom >= zoom ? newLong : longitude,
        latitude: newZoom >= zoom ? newLat : latitude,
        // latitude: newLat, // latScale(viewport.zoom),
        zoom: Math.max(newZoom, zoom),
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
        zoom: 20
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
