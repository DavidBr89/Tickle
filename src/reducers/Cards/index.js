import generate from 'firebase-auto-ids';
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
  RECEIVE_CARDS,
  RECEIVE_AUTHORED_CARDS,
  CREATE_CARD
} from './actions';

const gen = new generate.Generator();

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
    case RECEIVE_AUTHORED_CARDS: {
      const cards = action.options;
      const createdCards = cards.map(c => ({ ...c, edit: true }));

      return {
        ...state,
        createdCards
        // cards
        // isCardDragging
      };
    }

    case RECEIVE_CARDS: {
      const cards = action.options;

      return {
        ...state,
        accessibleCards: cards.map(c => ({ ...c, edit: false }))
        // defaultCards: cards
        // isCardDragging
      };
    }

    case CREATE_CARD: {
      const { createdCards, cardTemplate } = state;

      const { cardData, mapViewport } = action.options;
      const { x, y, tx, ty, vx, vy, ...restData } = cardData;
      const vp = new PerspectiveMercatorViewport(mapViewport);
      const [longitude, latitude] = vp.unproject([x, y]);

      //
      const newCard = {
        ...restData,
        loc: { latitude, longitude },
        template: false,
        // TODO: change
        id: gen.generate(Date.now())
      };

      db.doCreateCard(newCard);

      const newCards = [...createdCards, newCard];

      return {
        ...state,
        createdCards: newCards,
        selectedCardId: newCard.id
      };
    }

    case UPDATE_CARD: {
      const { createdCards} = state;

      const { cardData, mapViewport} = action.options;
      const { x, y, tx, ty, vx, vy, ...restData } = cardData;

      const vp = new PerspectiveMercatorViewport(mapViewport);

      const [longitude, latitude] = vp.unproject([x, y]);
      const updatedCard = {
        ...restData,
        loc: { latitude, longitude }
      };

      // db.doUpdateCard(updatedCard);

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
