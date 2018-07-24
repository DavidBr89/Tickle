// import generate from 'firebase-auto-ids';
// import { combineReducers } from 'redux';
// import cards from './cards';
// import visibilityFilter from './visibilityFilter';
// import turf from 'turf';
// import booleanWithin from '@turf/boolean-within';

// import { getBoundingBox } from './utils';
// import { intersection } from 'lodash';

import updCardDataDim from './updateDataDimension';
import setify from 'Utils/setify';
import * as d3 from 'd3';
import * as chromatic from 'd3-scale-chromatic';
import chroma from 'chroma-js';

import { union, difference } from 'lodash';

// import setBBox from './fitbounds';
// import mapboxgl from 'mapbox-gl';

import {
  RECEIVE_PLACES,
  UPDATE_CARD,
  UPDATE_CARD_SUCCESS,
  UPDATE_CARD_TEMPLATE,
  RECEIVE_COLLECTIBLE_CARDS,
  RECEIVE_CREATED_CARDS,
  CREATE_CARD,
  SUCCESS_CREATE_CARD,
  ERROR_CREATE_CARD,
  DELETE_CARD,
  ERROR_DELETE_CARD,
  SUCCESS_DELETE_CARD,
  // SELECT_CARD,
  TOGGLE_CARD_CHALLENGE,
  // EXTEND_SELECTED_CARD,
  PLAY_CARD_CHALLENGE,
  // TOGGLE_CARD_AUTHORING,
  DRAG_CARD,
  LOADING_CARDS,
  TOGGLE_TSNE_VIEW,
  SUBMIT_CHALLENGE
  // ADD_CARD_FILTER,
  // REMOVE_CARD_FILTER,
  // FILTER_CARDS
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

const defaultLocation = {
  latitude: 50.85146,
  longitude: 4.315483,
  radius: 500
};

const defaultCardTemplate = {
  id: cardTemplateId,
  template: true,
  loc: defaultLocation,
  edit: true,
  tags: [],
  challenge: null,
  floorX: 0.5,
  floorY: 0.5
};

const tagColors = chromatic.schemeSet3
  .reverse()
  .map(c => chroma(c).alpha(0.04));

const INITIAL_STATE = {
  cardTemplateId,
  tagColors,
  collectibleCards: [],
  createdCards: [],
  tmpCards: [],
  // TODO: update
  tmpCard: defaultCardTemplate,
  challenges: [],
  cardChallengeOpen: false,
  selectedTags: []
  // filterSet: []
  // TODO: outsource
  //
  // TODO: adapt colors
};

const makeColorScale = cardSets =>
  d3
    .scaleOrdinal()
    .domain(cardSets.map(s => s.key))
    .range(tagColors);

// const cardTemplateId = 'temp';
function reducer(state = INITIAL_STATE, action) {
  // console.log('action', action);
  // const { selectedCardId } = state;

  switch (action.type) {
    case LOADING_CARDS: {
      return {
        ...state,
        loadingCards: true
      };
    }

    case RECEIVE_CREATED_CARDS: {
      const { tagColors } = state;
      const cards = action.options;
      const createdCards = cards.map(c => ({ ...c, edit: true }));

      const cardSets = setify(cards);

      return {
        ...state,
        createdCards,
        loadingCards: false,
        tagColorScale: makeColorScale(cardSets)
        // cards
        // isCardDragging
      };
    }

    case RECEIVE_COLLECTIBLE_CARDS: {
      const cards = action.options;

      const cardSets = setify(cards);
      return {
        ...state,
        collectibleCards: cards,
        loadingCards: false,
        tagColorScale: makeColorScale(cardSets)
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
      const { tmpCards, createdCards } = state;

      const newCard = action.options;

      const newCards = [...tmpCards, newCard];

      return {
        ...state,
        tmpCards: newCards,
        createdCards: [newCard, ...createdCards],
        tmpCard: defaultCardTemplate
      };
    }

    case ERROR_CREATE_CARD: {
      return state;
    }

    case UPDATE_CARD: {
      const { createdCards } = state;

      const updatedCard = action.options;
      console.log('updatedCard', updatedCard);

      const updatedCards = createdCards.map(c => {
        if (c.id === updatedCard.id) {
          console.log('change', updatedCard);
          return updatedCard;
        }
        return c;
      });

      return {
        ...state,
        // TODO: remove
        // tmpCards: updatedCards,
        createdCards: updatedCards
      };
      // const tmpCards = [...createdCards];

      // const cardIndex = tmpCards.findIndex(c => c.id === cardData.id);
      // console.log('cardIndex', cardIndex);
      // console.log('existAlready');
      // tmpCards[cardIndex] = { ...cards[cardIndex], ...cardData };
    }

    case SUBMIT_CHALLENGE: {
      const { collectibleCards } = state;

      const challengeSubmission = action.options;

      const updatedCards = collectibleCards.map(c => {
        if (c.id === challengeSubmission.cardId) {
          return { ...c, challengeSubmission };
        }
        return c;
      });

      return {
        ...state,
        // TODO: remove
        // tmpCards: updatedCards,
        collectibleCards: updatedCards
      };
      // const tmpCards = [...createdCards];

      // const cardIndex = tmpCards.findIndex(c => c.id === cardData.id);
      // console.log('cardIndex', cardIndex);
      // console.log('existAlready');
      // tmpCards[cardIndex] = { ...cards[cardIndex], ...cardData };
    }
    // case SELECT_CARD: {
    //   const { cards } = state;
    //   const selectedCardId = action.options;
    //   return {
    //     ...state,
    //     selectedCardId
    //   };
    // }

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

    // case EXTEND_SELECTED_CARD: {
    //   const { selectedCardId } = state;
    //   const extCardId = action.options;
    //   // console.log('extCardId', extCardId);
    //   // TODO: update
    //   return { ...state, extCardId };
    // }

    case UPDATE_CARD_TEMPLATE: {
      const { cardData, viewport, dataView } = action.options;

      console.log('viewport', viewport);
      const updatedTemplate = updCardDataDim({
        rawData: { ...cardData, template: true },
        viewport,
        dataView
      });

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

    // case ADD_CARD_FILTER: {
    //   const { filterSet } = state;
    //   const tag = action.options;
    //
    //   return {
    //     ...state,
    //     filterSet: [...filterSet, tag]
    //     // selectedCardId: null
    //   };
    // }
    //
    // case REMOVE_CARD_FILTER: {
    //   const { filterSet } = state;
    //   const tag = action.options;
    //
    //   return {
    //     ...state,
    //     filterSet: difference(filterSet, [tag])
    //     // selectedCardId: null
    //   };
    // }
    //
    // case FILTER_CARDS: {
    //   const filterSet = action.options;
    //   return { ...state, filterSet };
    // }

    // case TOGGLE_CARD_AUTHORING: {
    //   const { userLocation, width, height } = action.options;
    //   const enabled = !state.authEnv;
    //
    //   // const authEnvCards = [...createdCards, cardTemplate];
    //
    //   return {
    //     ...state,
    //     authEnv: enabled,
    //     // authEnvCards,
    //     cardTemplate: {},
    //     selectedCardId: enabled ? cardTemplateId : null
    //     // cards
    //     // isCardDragging
    //   };
    // }

    case DRAG_CARD: {
      const isCardDragging = action.options;
      return {
        ...state,
        isCardDragging
      };
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
