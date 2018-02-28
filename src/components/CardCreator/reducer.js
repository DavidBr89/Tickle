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
  UPDATE_CARD_LOCATION,
  CREATE_CARD,
  DRAG_CARD,
  OPEN_CARD_DETAILS,
  TOGGLE_CARD_TEMPLATE,
  UPDATE_CARD_TEMPLATE,
  UPDATE_CARD_ATTRS,
  RECEIVE_CHALLENGES
} from './actions';

import { timespec } from './helper';

// const tif = timeFormat(timespec);

// const mapViewApp = combineReducers({
//   cards,
//   visibilityFilter
// });
//
// export default mapViewApp;

function reducer(state = {}, action) {
  console.log(action.type, action.options); // eslint-disable-line no-console
  switch (action.type) {
    case RECEIVE_CHALLENGES: {
      const { challenges } = action;
      console.log('action', action);
      return { ...state, challenges };
    }

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
        mapViewport,
        throttle: true
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
      return {
        ...state,
        mapViewport: state.oldViewport,
        selected: state.extended ? state.selected : null,
        extended: null,
        throttle: false
      };
    }
    case OPEN_CARD_DETAILS: {
      const selectedCardId = action.options;

      return {
        ...state,
        highlighted: true
      };
    }
    case UPDATE_CARD_LOCATION: {
      const { width, height, mapViewport, cards } = state;
      const { id, x, y } = action.options;

      const mercator = new ViewportMercator({ width, height, ...mapViewport });
      const { unproject } = mercator;
      const [longitude, latitude] = unproject([x, y]);

      const foundCard = cards.find(c => c.id === id);
      const updatedCard = {
        ...foundCard,
        loc: { longitude, latitude }
      };
      const oldCards = cards.filter(c => c.id !== foundCard.id);
      return { ...state, cards: [...oldCards, updatedCard], throttle: false };
    }

    case UPDATE_CARD_TEMPLATE: {
      const newCardTemplate = { ...state.cardTemplate, ...action.options };
      return { ...state, cardTemplate: newCardTemplate };
    }

    case UPDATE_CARD_ATTRS: {
      const { cards } = state;
      const { id } = action.options;
      // TODO: create new card here, not obvious
      const oldCard = cards.find(c => c.id === id);
      const updatedCard = { ...oldCard, ...action.options };
      const oldCards = cards.filter(c => c.id !== oldCard.id);
      return { ...state, cards: [...oldCards, updatedCard] };
    }

    case CREATE_CARD: {
      const { width, height, mapViewport } = state;
      const { x, y } = action.options;

      const mercator = new ViewportMercator({ width, height, ...mapViewport });
      const { unproject } = mercator;
      const [longitude, latitude] = unproject([x, y]);

      const card = {
        ...state.cardTemplate,
        template: false,
        // id: state.cards.length ,
        date: new Date(),
        loc: { latitude, longitude }
      };

      return {
        ...state,
        // TODO: change later
        cardTemplate: {
          id: state.cards.length + 1,
          template: true,
          loc: { latitude: 0, longitude: 0 }
        },
        cards: [...state.cards, card],
        isDragging: false
      };
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
      const newCardTemplate = action.options;
      // console.log('Card template', cardTemplateOpen);
      return {
        ...state,
        cardTemplate: { ...state.cardTemplate, ...newCardTemplate }
      };
    }
    default:
      return state;
  }
}

export default reducer;
