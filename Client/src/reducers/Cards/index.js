// import updCardDataDim from './updateDataDimension';
import setify from 'Components/utils/setify';

import uniqBy from 'lodash/uniqBy';

import {
  initCardFields,
  cardFieldKeys as initCardFieldKeys
} from 'Constants/cardFields';

import {
  RECEIVE_PLACES,
  UPDATE_CARD,
  // UPDATE_CARD_SUCCESS,
  UPDATE_CARD_TEMPLATE,
  RECEIVE_COLLECTIBLE_CARDS,
  RECEIVE_TOPICS,
  RECEIVE_CREATED_CARDS,
  CREATE_CARD,
  SUCCESS_CREATE_CARD,
  ERROR_CREATE_CARD,
  DELETE_CARD,
  DELETE_TOPIC,
  ERROR_DELETE_CARD,
  SUCCESS_DELETE_CARD,
  SEE_CARD,
  // SELECT_CARD,
  TOGGLE_CARD_CHALLENGE,
  // EXTEND_SELECTED_CARD,
  // TOGGLE_CARD_AUTHORING,
  DRAG_CARD,
  LOADING_CARDS,
  TOGGLE_TSNE_VIEW,
  SUBMIT_CHALLENGE,
  PUT_TOPIC,
  ADD_CARD_FIELD,
  RECEIVE_CARD_FIELDS,
  DELETE_CARD_FIELD
  // ADD_CARD_FILTER,
  // REMOVE_CARD_FILTER,
  // FILTER_CARDS
} from './actions';

const isDefined = a => a !== null && a !== undefined;

const cardTemplateId = 'temp';

const defaultLocation = {
  latitude: 50.85146,
  longitude: 4.315483,
  radius: 500
};

const defaultCardTemplate = {
  ...initCardFields,
  title: {value: 'New Card'},
  loc: {value: defaultLocation}
};

const INITIAL_STATE = {
  cardFieldKeys: initCardFieldKeys,
  cardTemplateId,
  collectibleCards: [],
  createdCards: [],
  // TODO remove
  topicVocabulary: [],
  topicDict: [],
  tmpCard: defaultCardTemplate,
  challenges: [],
  cardChallengeOpen: false,
  selectedTags: []
};

// const cardTemplateId = 'temp';
function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOADING_CARDS: {
      const isLoadingCards = action.options;
      return {
        ...state,
        isLoadingCards
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
      const createdCards = action.options;

      // const topicVocabulary = setify(
      //   uniqBy([...createdCards, ...collectibleCards], 'id')
      // );

      return {
        ...state,
        createdCards,
        // TODO REMOVE
        // topicVocabulary,
        // topicDict: topicVocabulary,
        tmpCard: defaultCardTemplate
      };
    }

    case RECEIVE_TOPICS: {
      const topicDict = action.options;
      return {...state, topicDict};
    }

    case DELETE_TOPIC: {
      const id = action.options;
      const {topicDict} = state;
      return {...state, topicDict: topicDict.filter(d => d.id !== id)};
    }

    case RECEIVE_COLLECTIBLE_CARDS: {
      const collectibleCards = action.options;
      const {createdCards} = state;

      const topicVocabulary = setify(
        uniqBy([...collectibleCards, ...createdCards], 'id')
      );

      return {
        ...state,
        collectibleCards,
        topicVocabulary,
        tmpCard: defaultCardTemplate
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
      const {createdCards, collectibleCards} = state;

      const newCard = action.options;

      return {
        ...state,
        createdCards: [newCard, ...createdCards],
        collectibleCards: [newCard, ...collectibleCards],
        tmpCard: defaultCardTemplate
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
      const updatedCollectibleCards = collectibleCards.map(
        doUpdateCard
      );

      return {
        ...state,
        // TODO: remove
        // tmpCards: updatedCards,
        createdCards: updatedCreatedCards,
        collectibleCards: updatedCollectibleCards
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
        collectibleCards: updatedCards
      };
    }

    case TOGGLE_CARD_CHALLENGE: {
      const {cardChallengeOpen} = action.options;
      return {
        ...state,
        cardChallengeOpen
      };
    }

    case UPDATE_CARD_TEMPLATE: {
      const {tmpCard} = state;
      const card = action.options;

      return {...state, tmpCard: {...tmpCard, ...card, template: true}};
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
        extCardId: null
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
            location: {lat: latitude, lng: longitude}
          },
          types: tags,
          name: title
        }) => ({
          id,
          loc: {latitude, longitude},
          tags,
          title,
          challenge: {type: null},
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

    case PUT_TOPIC: {
      const newTopic = action.options;
      const {topicDict} = state;

      const alreadyExist =
        topicDict.find(d => d.id === newTopic.id) || null;

      const newTopicDict =
        alreadyExist !== null
          ? topicDict.map(d => (d.id === newTopic.id ? newTopic : d))
          : [newTopic, ...topicDict];

      return {
        ...state,
        topicDict: newTopicDict
        // isLoadingCards
      };
    }

    case ADD_CARD_FIELD: {
      const cKey = action.options;
      return {...state, cardFieldKeys: [...state.cardFieldKeys, cKey]};
    }
    case RECEIVE_CARD_FIELDS: {
    }

    case DELETE_CARD_FIELD: {
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
