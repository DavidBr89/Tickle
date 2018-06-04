const INITIAL_STATE = {
  dataView: 'geo'
};

export default function dataViewReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'TOGGLE_DATA_VIEW': {
      return { ...state, dataView: action.options };
    }
    default:
      return state;
  }
}
