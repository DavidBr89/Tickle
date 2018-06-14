import { TOGGLE_DATA_VIEW, FILTER } from './actions';

const INITIAL_STATE = {
  dataView: 'geo',
  searchString: null
};

export default function dataViewReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TOGGLE_DATA_VIEW: {
      return { ...state, dataView: action.options };
    }
    case 'FILTER': {
      return {
        ...state,
        searchString: action.options !== '' ? action.options : null
      };
    }
    default:
      return state;
  }
}
