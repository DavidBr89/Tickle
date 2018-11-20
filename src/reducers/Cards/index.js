// import updCardDataDim from './updateDataDimension';
import setify from 'Components/utils/setify';

import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';

import {initCard} from 'Constants/cardFields';
import {
  RECEIVE_PLACES,
  UPDATE_CARD,
  // UPDATE_CARD_SUCCESS,
  UPDATE_CARD_TEMPLATE,
  RECEIVE_COLLECTIBLE_CARDS,
  RECEIVE_CREATED_CARDS,
  CREATE_CARD,
  SUCCESS_CREATE_CARD,
  ERROR_CREATE_CARD,
  DELETE_CARD,
  ERROR_DELETE_CARD,
  SUCCESS_DELETE_CARD,
  SEE_CARD,
  // SELECT_CARD,
  TOGGLE_CARD_CHALLENGE,
  // EXTEND_SELECTED_CARD,
  PLAY_CARD_CHALLENGE,
  // TOGGLE_CARD_AUTHORING,
  DRAG_CARD,
  LOADING_CARDS,
  TOGGLE_TSNE_VIEW,
  SUBMIT_CHALLENGE,
  // ADD_CARD_FILTER,
  // REMOVE_CARD_FILTER,
  // FILTER_CARDS
} from './actions';

const isDefined = a => a !== null && a !== undefined;

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
  radius: 500,
};

const defaultCardTemplate = initCard;

const INITIAL_STATE = {
  cardTemplateId,
  collectibleCards: [],
  createdCards: [],
  tagVocabulary: [],
  // TODO: update
  tmpCard: defaultCardTemplate,
  challenges: [],
  cardChallengeOpen: false,
  selectedTags: [],
  // TODO: change later
  // filterSet: []
  // TODO: outsource
  //
  // TODO: adapt colors
};

// const cardTemplateId = 'temp';
function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOADING_CARDS: {
      const isLoadingCards = action.options;
      return {
        ...state,
        isLoadingCards,
      };
    }

    case SEE_CARD: {
      const {collectibleCards} = state;
      const id = action.options;

      const updatedCollectibleCards = collectibleCards.map(d => {
        if (d.id === id) return {...d, seen: true};
        return d;
      });

      return {...state, collectibleCards: updatedCollectibleCards};
    }

    case RECEIVE_CREATED_CARDS: {
      const {collectibleCards} = state;
      const cards = action.options;

      const createdCards = cards.map(c => ({...c, edit: true}));

      const tagVocabulary = setify(
        uniqBy([...createdCards, ...collectibleCards]),
        'id',
      );

      // const cardSets = setify(cards);
      // const tagColorScale = makeTagColorScale(cardSets);

      return {
        ...state,
        createdCards,
        tagVocabulary,
        // loadingCards: false
        // tagVocabulary
        // tagColorScale
        // cards
        // isCardDragging
      };
    }

    case RECEIVE_COLLECTIBLE_CARDS: {
      const collectibleCards = action.options;
      const {createdCards} = state;

      const tagVocabulary = setify(
        uniqBy([...collectibleCards, ...createdCards], 'id'),
      );
      // const tagVocabulary = uniq(
      //   cards.reduce((acc, c) => [...acc, ...c.tags], [])
      // );
      return {
        ...state,
        collectibleCards,
        // nestedTagVocabulary,
        // submittedCards,
        // startedCards,
        tagVocabulary,
        // loadingCards: false
        // tagColorScale
        // defaultCards: cards
        // isCardDragging
      };
    }

    case SUCCESS_CREATE_CARD: {
      // const { createdCards, cardTemplate } = state;

      // const newCard = action.options;

      // const newCards = [...createdCards, newCard];

      return {
        ...state,
        // createdCards: newCards,
        // selectedCardId: newCard.id
      };
    }
    case CREATE_CARD: {
      const {createdCards, collectibleCards} = state;

      const newCard = action.options;

      const tagVocabulary = setify(
        uniqBy([...collectibleCards, ...createdCards, newCard], 'id'),
      );

      return {
        ...state,
        createdCards: [newCard, ...createdCards],
        collectibleCards: [newCard, ...collectibleCards],
        tmpCard: defaultCardTemplate,
        tagVocabulary,
      };
    }

    case ERROR_CREATE_CARD: {
      return state;
    }

    case UPDATE_CARD: {
      const {createdCards, collectibleCards} = state;
      const updatedCard = action.options;

      const doUpdateCard = c => {
        if (c.id === updatedCard.id) {
          return updatedCard;
        }
        return c;
      };

      const updatedCreatedCards = createdCards.map(doUpdateCard);
      const updatedCollectibleCards = collectibleCards.map(doUpdateCard);

      return {
        ...state,
        // TODO: remove
        // tmpCards: updatedCards,
        createdCards: updatedCreatedCards,
        collectibleCards: updatedCollectibleCards,
      };
    }

    case SUBMIT_CHALLENGE: {
      const {collectibleCards} = state;

      const challengeSubmission = action.options;

      const updatedCards = collectibleCards.map(c => {
        if (c.id === challengeSubmission.cardId) {
          return {...c, challengeSubmission};
        }
        return c;
      });

      return {
        ...state,
        // TODO: remove
        // tmpCards: updatedCards,
        collectibleCards: updatedCards,
      };
    }

    case TOGGLE_CARD_CHALLENGE: {
      const {cardChallengeOpen} = action.options;
      return {
        ...state,
        cardChallengeOpen,
      };
    }

    case UPDATE_CARD_TEMPLATE: {
      const card = action.options;
      console.log('TEMPLATE CARD', card);
      return {...state, tmpCard: {...card, template: true}};
    }
    case DELETE_CARD: {
      const {createdCards} = state;
      const cid = action.options;

      const oldCardIndex = createdCards.findIndex(c => c.id === cid);
      const newCreatedCards = createdCards.filter(c => c.id !== cid);
      // console.log('jump to', cid, Math.max(0, oldCardIndex - 1));
      // const selectedCardId = newCreatedCards[newCreatedCards.length - 1].id;
      return {
        ...state,
        createdCards: newCreatedCards,
        extCardId: null,
        // selectedCardId: 'temp'
      };
    }
    case SUCCESS_DELETE_CARD: {
      return state;
    }
    case ERROR_DELETE_CARD: {
      return state;
    }

    case RECEIVE_PLACES: {
      const {results: places} = action.options;
      // console.log('places', places);
      const placeCards = places.map(
        ({
          id,
          geometry: {
            location: {lat: latitude, lng: longitude},
          },
          types: tags,
          name: title,
        }) => ({
          id,
          loc: {latitude, longitude},
          tags,
          title,
          challenge: {type: null},
          media: [],
        }),
      );
      // console.log('cardPlaces', placeCards);
      // const newCards = [...state.cards, ...placeCards];
      // console.log('newCards', state.cards, placeCards);
      return {
        ...state,
        accessibleCards: placeCards,
        defaultCards: placeCards,
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
        isCardDragging,
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
      return {...state, tsneView: !state.tsneView};
    }

    default:
      return state;
    // default: {
    //   console.log('action', action);
    // }
  }
}

export default reducer;
