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
import { getBoundingBox } from './utils';
import { intersection } from 'lodash';

import firestore from 'DB';

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
  // FLY_TO_USER,
  TOGGLE_TAG_LIST,
  TOGGLE_GRID_VIEW,
  TOGGLE_TSNE_VIEW,
  TOGGLE_SEARCH,
  RECEIVE_PLACES,
  FILTER_CARDS,
  DRAG_CARD,
  CREATE_OR_UPDATE_CARD,
  RECEIVE_CARDS,
  CHANGE_VIEWPORT
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

const offsetMapViewport = ({
  width,
  height,
  zoom,
  latitude,
  longitude,
  offset: [offsetX = 0, offsetY = 0]
}) => {
  const vp = new PerspectiveMercatorViewport({
    width,
    height,
    zoom,
    latitude,
    longitude
  });

  const [offsetLng, offsetLat] = vp.unproject([
    offsetX ? width / 2 + offsetX : width / 2,
    offsetY ? height / 2 + offsetY : height / 2
  ]);

  const ret = new PerspectiveMercatorViewport({
    width,
    height,
    zoom,
    latitude: offsetLat,
    longitude: offsetLng
  });
  console.log('return', longitude, latitude, offsetLng, offsetLat);
  return ret;
};

function reducer(state = {}, action) {
  // console.log('action', action);
  // const { selectedCardId } = state;

  switch (action.type) {
    case CHANGE_VIEWPORT: {
      const cards = action.options;

      return {
        ...state,
        // cards
        // isCardDragging
      };
    }

    case RECEIVE_CARDS: {
      const cards = action.options;
      console.log('RECEIVE_CARDS', cards);

      return {
        ...state,
        cards,
        defaultCards: cards
        // isCardDragging
      };
    }

    case CREATE_OR_UPDATE_CARD: {
      const {
        width,
        height,
        zoom,
        latitude: centerLat,
        longitude: centerLng,
        cards
      } = state;

      const { x, y, id } = action.options;
      const vp = new PerspectiveMercatorViewport({
        width,
        height,
        zoom,
        latitude: centerLat,
        longitude: centerLng
      });

      const [longitude, latitude] = vp.unproject([x, y]);

      const newCard = {
        ...cards.find(c => c.id === id),
        loc: { longitude, latitude }
      };

      // firestore.collection('cards').add(newCard);

      return {
        ...state
        // isCardDragging
      };
    }
    case DRAG_CARD: {
      const isCardDragging = action.options;
      return {
        ...state,
        isCardDragging
      };
    }
    case TOGGLE_SEARCH: {
      const isSearching = action.options;
      return {
        ...state,
        isSearching,
        selectedCardId: !isSearching ? state.selectedCardId : null,
        selectedCardIdCache: state.selectedCardId
      };
    }
    case TOGGLE_TAG_LIST: {
      return { ...state, tagListView: !state.tagListView, gridView: false };
    }
    case FILTER_CARDS: {
      console.log('action', action);
      const selectedTags = action.options;
      // if (selectedTags.length === 0)
      //   return { ...state, cards: state.defaultCards };
      // TODO: fix filtering
      const cards = state.cards.filter(
        c =>
          selectedTags.length === 0 ||
          intersection(c.tags, selectedTags).length > 0
      );
      console.log('cards', cards);
      return { ...state, cards, selectedTags };
    }
    case RECEIVE_PLACES: {
      const { results: places } = action.options;
      // console.log('places', places);
      const placeCards = places.map(
        ({
          id,
          geometry: {
            location: { lat: latitude, lng: longitude }
          },
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
      // console.log('cardPlaces', placeCards);
      const newCards = [...state.cards, ...placeCards];
      return { ...state, cards: newCards, defaultCards: newCards };
    }
    case TOGGLE_TSNE_VIEW: {
      return { ...state, tsneView: !state.tsneView };
    }
    case TOGGLE_GRID_VIEW: {
      const { selectedCardId } = state;
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
        tagListView: false,
        longitude: bottomLng,
        latitude: bottomLat,
        selectedCardId: !gridView
          ? null
          : selectedCardId || state.cacheSelectedCardId,
        cacheSelectedCardId: selectedCardId
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
      const {
        cards,
        selectedCardId,
        userLocation,
        width,
        height,
        gridView,
        defaultZoom,
        selectedTags,
        tagListView
      } = state;
      // if (state.extCardId !== null) return state;
      const { longitude, latitude, zoom } = action.options;

      if (zoom <= defaultZoom) return { ...state };

      const bbox = getBoundingBox(
        cards
          .map(({ loc }) => [loc.longitude, loc.latitude])
          .concat([[userLocation.longitude, userLocation.latitude]])
      );

      const selCard = cards.find(d => d.id === selectedCardId);
      const { longitude: centerLng, latitude: centerLat } = selCard
        ? selCard.loc
        : { longitude, latitude };

      const { zoom: minZoom, longitude: newLng, latitude: newLat } = (() => {
        const offset = [0, gridView ? -height / 4 : 0];
        if (zoom <= defaultZoom) {
          return offsetMapViewport({
            width,
            height,
            zoom: 8,
            latitude: centerLat,
            longitude: centerLng,
            offset
          }).fitBounds(bbox, {
            padding: 10,
            // offset
            offset: [0, height / 2]
          });
        }
        return offsetMapViewport({
          width,
          height,
          zoom,
          latitude: centerLat,
          longitude: centerLng,
          offset
        });
        // .fitBounds(bbox, {
        //   // padding: 10,
        //   offset: [0, 0]
        // });
      })();

      // const screenVp = new PerspectiveMercatorViewport({
      //   width,
      //   height: height - 50,
      //   zoom,
      //   latitude: centerLat,
      //   longitude: centerLng
      // });

      // // TODO: this is too slow
      // const newCards = state.defaultCards.filter(({ loc, tags }) => {
      //   const [x, y] = screenVp.project([loc.longitude, loc.latitude]);
      //   const tagBool =
      //     selectedTags.length === 0 ||
      //     intersection(selectedTags, tags).length > 0;
      //   return tagBool && y > 0 && y < height && x > 0 && x < width;
      // });

      // console.log('newCards', newCards);

      return {
        ...state,
        longitude, // : newLng,
        latitude, // : newLat,
        // birdsEyeView,
        // cards: newCards,

        // latitude: newLat, // latScale(viewport.zoom),
        zoom, // : Math.max(minZoom, zoom),
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

      const mapViewport = offsetMapViewport({
        width,
        height,
        ...selectedCard.loc,
        zoom: 10,
        offset: [0, -height / 4]
      });

      console.log('mapViewport', mapViewport);
      const { latitude, longitude, zoom } = mapViewport;

      // const vp = new PerspectiveMercatorViewport({
      //   mapViewport
      // });

      // const newCards = state.defaultCards.filter(({ loc }) => {
      //   const [x, y] = vp.project([loc.longitude, loc.latitude]);
      //   return x > 0 && x < width && y > 0 && y < height;
      // });

      return {
        ...state,
        ...mapViewport,
        latitude,
        longitude,
        zoom,
        direction: null,
        selectedCardId,
        // cards: selectedCardId !== null ? newCards : state.cards,
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
