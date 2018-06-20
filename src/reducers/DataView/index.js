import { TOGGLE_DATA_VIEW, FILTER } from './actions';

const INITIAL_STATE = {
  dataView: 'geo',
  // searchString: null
  filterSet: { key: 'all', set: null }
};

export default function dataViewReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TOGGLE_DATA_VIEW: {
      return { ...state, dataView: action.options };
    }
    case 'FILTER': {
      const filterSet = action.options;
      return {
        ...state,
        filterSet
      };
    }
    default:
      return state;
  }
}
