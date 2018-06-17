// import generate from 'firebase-auto-ids';
// import { combineReducers } from 'redux';
// import cards from './cards';
// import visibilityFilter from './visibilityFilter';
// import turf from 'turf';
// import booleanWithin from '@turf/boolean-within';
import {
  // WebMercatorViewport,
  PerspectiveMercatorViewport
} from 'viewport-mercator-project';

// import { getBoundingBox } from './utils';
// import { intersection } from 'lodash';

// import { db } from 'Firebase';

// import setBBox from './fitbounds';
// import mapboxgl from 'mapbox-gl';

import {
  RECEIVE_PLACES,
  FILTER_CARDS,
  UPDATE_CARD,
  UPDATE_CARD_TEMPLATE,
  RECEIVE_READABLE_CARDS,
  RECEIVE_CREATED_CARDS,
  CREATE_CARD,
  SUCCESS_CREATE_CARD,
  ERROR_CREATE_CARD,
  DELETE_CARD,
  ERROR_DELETE_CARD,
  SUCCESS_DELETE_CARD,
  SELECT_CARD,
  TOGGLE_CARD_CHALLENGE,
  EXTEND_SELECTED_CARD,
  PLAY_CARD_CHALLENGE,
  TOGGLE_CARD_AUTHORING,
  DRAG_CARD,
  TOGGLE_TSNE_VIEW
} from './actions';

// const gen = new generate.Generator();

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

function updCardLoc(cardData, mapViewport) {
  const { x, y, tx, ty, vx, vy, ...restData } = cardData;

  const vp = new PerspectiveMercatorViewport(mapViewport);

  const [longitude, latitude] = vp.unproject([x, y]);
  const updatedCard = {
    ...restData,
    loc: { latitude, longitude }
  };
  return updatedCard;
}

function updCardFloorLoc(cardData, width, height) {
  return {
    ...cardData,
    floorLoc: {
      relX: cardData.x / width,
      relY: cardData.y / height
    }
  };
}

function updCardTopic(cardData) {
  return { ...cardData };
}

function updCard({ cardData, mapViewport, dataView }) {
  const { width, height } = mapViewport;
  switch (dataView) {
    case 'geo':
      return updCardLoc(cardData, mapViewport);
    case 'topic':
      return updCardTopic(cardData);
    case 'floorplan':
      return updCardFloorLoc(cardData, width, height);
    default:
      return updCardLoc(cardData, mapViewport);
  }
}

const cardTemplateId = 'temp';
// const cardTemplateId = 'temp';
function reducer(state = {}, action) {
  // console.log('action', action);
  // const { selectedCardId } = state;

  switch (action.type) {
    case RECEIVE_CREATED_CARDS: {
      const cards = action.options;
      const createdCards = cards.map(c => ({ ...c, edit: true }));

      return {
        ...state,
        createdCards
        // cards
        // isCardDragging
      };
    }

    case RECEIVE_READABLE_CARDS: {
      const cards = action.options;

      return {
        ...state,
        readableCards: cards.map(c => ({ ...c, edit: false }))
        // defaultCards: cards
        // isCardDragging
      };
    }

    case SUCCESS_CREATE_CARD: {
      // const { createdCards, cardTemplate } = state;

      // const newCard = action.options;

      // const newCards = [...createdCards, newCard];

      return {
        ...state
        // createdCards: newCards,
        // selectedCardId: newCard.id
      };
    }
    case CREATE_CARD: {
      const { createdCards } = state;

      const newCard = action.options;

      const newCards = [...createdCards, newCard];

      return {
        ...state,
        createdCards: newCards,
        selectedCardId: newCard.id,
        extCardId: null,
        tmpCard: {}
      };
    }

    case ERROR_CREATE_CARD: {
      return state;
    }

    case UPDATE_CARD: {
      const { createdCards } = state;

      const { uid, cardData, mapViewport, dataView } = action.options;

      const updatedCard = updCard({ cardData, mapViewport, dataView });

      // TODO: on Success/Error
      // db.doUpdateCard(uid, updatedCard);

      const updatedCards = createdCards.map(c => {
        if (c.id === cardData.id) {
          return { id: c.id, ...updatedCard };
        }
        return c;
      });

      return {
        ...state,
        createdCards: updatedCards
        // authoredCards

        // isCardDragging
      };
      // const tmpCards = [...createdCards];

      // const cardIndex = tmpCards.findIndex(c => c.id === cardData.id);
      // console.log('cardIndex', cardIndex);
      // console.log('existAlready');
      // tmpCards[cardIndex] = { ...cards[cardIndex], ...cardData };
    }

    case SELECT_CARD: {
      const selectedCardId = action.options;
      return {
        ...state,
        selectedCardId
      };
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

    case EXTEND_SELECTED_CARD: {
      const extCardId = action.options;
      // console.log('extCardId', extCardId);
      // TODO: update
      return { ...state, extCardId };
    }

    case UPDATE_CARD_TEMPLATE: {
      const { cardData: cardTemplate, mapViewport, dataView } = action.options;
      const updatedTemplate = updCard({
        cardData: cardTemplate,
        mapViewport,
        dataView
      });
      console.log('cardTemplate', cardTemplate);
      return { ...state, tmpCard: updatedTemplate };
    }
    case DELETE_CARD: {
      const { createdCards } = state;
      const cid = action.options;

      const oldCardIndex = createdCards.findIndex(c => c.id === cid);
      const newCreatedCards = createdCards.filter(c => c.id !== cid);
      // console.log('jump to', cid, Math.max(0, oldCardIndex - 1));
      // const selectedCardId = newCreatedCards[newCreatedCards.length - 1].id;
      return {
        ...state,
        createdCards: newCreatedCards,
        extCardId: null,
        selectedCardId: 'temp'
      };
    }
    case SUCCESS_DELETE_CARD: {
      return state;
    }
    case ERROR_DELETE_CARD: {
      return state;
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
          challenge: { type: null },
          media: []
        })
      );
      // console.log('cardPlaces', placeCards);
      // const newCards = [...state.cards, ...placeCards];
      // console.log('newCards', state.cards, placeCards);
      return {
        ...state,
        accessibleCards: placeCards,
        defaultCards: placeCards
      };
    }

    case TOGGLE_CARD_AUTHORING: {
      const { userLocation, width, height } = action.options;
      const enabled = !state.authEnv;

      // const authEnvCards = [...createdCards, cardTemplate];

      return {
        ...state,
        authEnv: enabled,
        // authEnvCards,
        cardTemplate: {},
        selectedCardId: enabled ? cardTemplateId : null
        // cards
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

    case FILTER_CARDS: {
      // console.log('action', action);
      const selectedTags = action.options;
      // if (selectedTags.length === 0)
      //   return { ...state, cards: state.defaultCards };
      // TODO: fix filtering
      // const cards = state.cards.filter(
      //   c =>
      //     selectedTags.length === 0 ||
      //     intersection(c.tags, selectedTags).length > 0
      // );
      return { ...state };
    }
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
    case TOGGLE_TSNE_VIEW: {
      return { ...state, tsneView: !state.tsneView };
    }
  }

  return state;
}

export default reducer;
