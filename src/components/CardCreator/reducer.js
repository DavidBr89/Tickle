// import { combineReducers } from 'redux';
// import cards from './cards';
// import visibilityFilter from './visibilityFilter';
import ViewportMercator from 'viewport-mercator-project';
import { timeFormat } from 'd3';
import {
  CARD_CREATOR_SCREEN_RESIZE,
  CHANGE_MAP_VIEWPORT,
  SELECT_CARD,
  UPDATE_CARD,
  CREATE_CARD,
  DRAG_CARD,
  OPEN_CARD_DETAILS,
  TOGGLE_CARD_TEMPLATE,
  UPDATE_CARD_TEMPLATE
} from './actions';

import { timespec } from './helper';

const tif = timeFormat(timespec);

// const mapViewApp = combineReducers({
//   cards,
//   visibilityFilter
// });
//
// export default mapViewApp;

const EmptyCard = ({ latitude, longitude }) => ({
  // title: '-',
  // type: '-',
  date: tif(new Date()),
  // tags: ['', ''],
  // img: '',
  // xpPoints: 0,
  // TODO: remove in future to component
  // description: '',
  loc: { latitude, longitude }
  // creator: 'Jan',
  // media: [],
  // friends: [],
  // rating: [],
  // cardSets: [],
  // linkedCards: []
});

function reducer(state = {}, action) {
  console.log(action.type, action.options); // eslint-disable-line no-console
  switch (action.type) {
    case CARD_CREATOR_SCREEN_RESIZE: {
      console.log('state taken', action);
      const height = action.options.height;
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
        const { latitude, longitude } = action.options.loc;
        const selected = { ...action.options };
        const mapViewport = {
          ...state.mapViewport,
          latitude,
          longitude,
          zoom: 20
        };
        const extended =
          state.selected && state.selected.id === selected.id ? selected : null;
        return {
          ...state,
          mapViewport,
          oldViewport: { ...mapViewport },
          selected,
          extended
        };
      }
      console.log('remove action');
      return {
        ...state,
        mapViewport: state.oldViewport,
        selected: state.extended ? state.selected : null,
        extended: null
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
        const card = EmptyCard({
          longitude: pos[0],
          latitude: pos[1]
        });
        card.temp = true;
        card.id = id;
        // console.log('newId', id);

        return {
          ...state,
          cardTemplate: {},
          cards: [...state.cards, card],
          isDragging: false
        };
      }
      const updatedCard = {
        ...foundCard,
        loc: { longitude: pos[0], latitude: pos[1] }
      };
      const oldCards = cards.filter(c => c.id !== foundCard.id);
      return { ...state, cards: [...oldCards, updatedCard] };
    }
    case DRAG_CARD: {
      const isDragging = action.options;
      return {
        ...state,
        // cards: [...state.cards].sort((a, b) => tip(a.date) - tip(b.date)),
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
    case UPDATE_CARD_TEMPLATE: {
      const cardTemplate = action.options;
      // console.log('Card template', cardTemplateOpen);
      return { ...state, cardTemplate };
    }
    default:
      return state;
  }
}

export default reducer;
