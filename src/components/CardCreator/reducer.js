// import { combineReducers } from 'redux';
// import cards from './cards';
// import visibilityFilter from './visibilityFilter';
import ViewportMercator from 'viewport-mercator-project';
import {
  CARD_CREATOR_SCREEN_RESIZE,
  CHANGE_MAP_VIEWPORT,
  SELECT_CARD,
  UPDATE_CARD,
  CREATE_CARD,
  DRAG_CARD,
  OPEN_CARD_DETAILS,
  TOGGLE_CARD_TEMPLATE
} from './actions';

// const mapViewApp = combineReducers({
//   cards,
//   visibilityFilter
// });
//
// export default mapViewApp;

const dummyCard = ({ latitude, longitude }) => ({
  title: '-',
  type: '-',
  // TODO: change
  id: Math.random() * 1000,
  date: '04/04/2012 10:00',
  tags: ['', ''],
  img: '',
  caption: '',
  xpPoints: 0,
  // TODO: remove in future to component
  description: '',
  loc: { latitude, longitude },
  creator: 'Jan',
  media: [],
  friends: [],
  rating: [],
  cardSets: [],
  linkedCards: []
});

function reducer(state = {}, action) {
  console.log(action.type, action.options); // eslint-disable-line no-console
  switch (action.type) {
    case CARD_CREATOR_SCREEN_RESIZE: {
      console.log('state taken', action);
      const height = action.options.height - state.headerPad;
      const width = action.options.width;
      return { ...state, width, height };
    }

    case CHANGE_MAP_VIEWPORT: {
      const mapViewport = action.options;

      return {
        ...state,
        mapViewport
      };
    }
    case SELECT_CARD: {
      const { width, height } = state;
      if (action.options) {
        const { latitude, longitude } = action.options.location;
        const selected = { ...action.options, extended: false };
        const mapViewport = {
          ...state.mapViewport,
          latitude,
          longitude,
          height: height * 1.5
        };
        return {
          ...state,
          mapViewport,
          oldViewport: { ...state.mapViewport },
          selected
        };
      }
      return {
        ...state,
        mapViewport: state.oldViewport,
        selected: null
      };
    }
    case OPEN_CARD_DETAILS: {
      const selectedCardId = action.options;

      return {
        ...state,
        highlighted: true
      };
    }
    case UPDATE_CARD: {
      const { selectedCardId } = action.options;

      return {
        ...state,
        selectedCardId
      };
    }
    // TODO: rename to update
    case CREATE_CARD: {
      const { width, height, mapViewport, cards } = state;
      const { id, x, y } = action.options;

      const mercator = new ViewportMercator({ width, height, ...mapViewport });
      const { unproject } = mercator;
      const pos = unproject([x, y]);

      const foundCard = cards.find(c => c.id === id);
      if (!foundCard) {
        const card = dummyCard({
          id: `tempCard${Math.random() * 10000}`,
          longitude: pos[0],
          latitude: pos[1]
        });
        card.temp = true;

        return {
          ...state,
          cards: [...state.cards, card],
          isDragging: false
        };
      }
      const updatedCard = {
        ...foundCard,
        loc: { longitude: pos[0], latitude: pos[1] }
      };
      console.log('foundCard', foundCard);
      const oldCards = cards.filter(c => c.id !== foundCard.id);
      return { ...state, cards: [...oldCards, updatedCard] };
    }
    case DRAG_CARD: {
      const isDragging = action.options;
      return {
        ...state,
        isDragging
      };
    }
    case TOGGLE_CARD_TEMPLATE: {
      console.log('card tem');
      // return {
      //
      //   ...state,
      //   isDragging: true
      // };
      return { ...state, cardTemplateOpen: !state.cardTemplateOpen };
    }
    default:
      return state;
  }
}

export default reducer;
