// import { combineReducers } from 'redux';
// import cards from './cards';
// import visibilityFilter from './visibilityFilter';
import { RECEIVE_CHALLENGES, SCREEN_RESIZE } from './actions';

// const mapViewApp = combineReducers({
//   cards,
//   visibilityFilter
// });
//
// export default mapViewApp;

function reducer(state = {}, action) {
  switch (action.type) {
    case RECEIVE_CHALLENGES: {
      const challenges = action.options;
      return { ...state, challenges };
    }
    case SCREEN_RESIZE: {
      const height = action.options.height;
      const width = action.options.width;
      const newState = { ...state, width, height };
      console.log('NEW_State saasasas', state, newState);
      return newState;
    }
    default:
      return state;
  }
}

export default reducer;
