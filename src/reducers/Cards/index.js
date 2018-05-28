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
import { intersection } from 'lodash';

import { db } from 'Firebase';

// import setBBox from './fitbounds';
// import mapboxgl from 'mapbox-gl';

import {
  // PLAY_CARD_CHALLENGE,
  // FLY_TO_USER,
  RECEIVE_PLACES,
  // FILTER_CARDS,
  UPDATE_CARD,
  UPDATE_CARD_TEMPLATE,
  RECEIVE_READABLE_CARDS,
  RECEIVE_CREATED_CARDS,
  CREATE_CARD,
  SUCCESS_CREATE_CARD,
  ERROR_CREATE_CARD,
  DELETE_CARD,
  ERROR_DELETE_CARD,
  SUCCESS_DELETE_CARD
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

const cardTemplateId = 'temp';
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

      const card = action.options;

      const newCards = [...createdCards, card];

      return {
        ...state,
        createdCards: newCards,
        selectedCardId: card.id,
        cardTemplate: state.defaultCardTemplate
      };
    }

    case ERROR_CREATE_CARD: {
      return state;
    }

    case UPDATE_CARD: {
      const { createdCards } = state;

      const { uid, cardData, mapViewport } = action.options;
      const { x, y, tx, ty, vx, vy, ...restData } = cardData;

      const vp = new PerspectiveMercatorViewport(mapViewport);

      const [longitude, latitude] = vp.unproject([x, y]);
      const updatedCard = {
        ...restData,
        loc: { latitude, longitude }
      };

      db.doUpdateCard(uid, updatedCard);

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

    case UPDATE_CARD_TEMPLATE: {
      const cardTemplate = action.options;
      return { ...state, cardTemplate };
    }
    case DELETE_CARD: {
      const { cards } = state;
      const cid = action.options;

      const newCards = cards.filter(c => c.id !== cid);
      return { ...state, cards: newCards };
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
  }
  return state;
}

export default reducer;
