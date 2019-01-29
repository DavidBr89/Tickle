import {
  AUTH_USER_SET,
  SET_AUTH_USER_INFO,
  CLEAR_AUTH_USER,
  ERROR_SUBMIT_USER,
  RECEIVE_USER_INFO,
  EXTEND_USER_INFO,
  SUBMIT_USER_INFO_TO_DB_SUCCESS,
  SET_USER_ENV,
  SET_TAG_TREE_DATA,
  ADD_TOPIC,
  REMOVE_TOPIC
  // SET_DEVICE
} from './actions';

const INITIAL_STATE = {
  authUser: null,
  cardSets: [],
  cards: [],
  // createdCards: [],
  // submittedCards: [],
  device: {smallScreen: false, iOs: false},
  userEnvId: 'staging',
  // tagTreeData: [],
  globalInterests: [],
  topicDict: []
};

function sessionReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case REMOVE_TOPIC: {
      const {topics} = state;
      const topicId = action.options;
      return {...state, topics: topics.filter(d => d.id !== topicId)};
    }
    case ADD_TOPIC: {
      const {topics} = state;
      const topic = action.options;
      return {...state, topicDict: [...topics, topic]};
    }
    case SET_TAG_TREE_DATA: {
      const tagTreeData = action.options;
      return {...state, tagTreeData};
    }
    case EXTEND_USER_INFO: {
      return {...state, userInfoExtended: !state.userInfoExtended};
    }
    case RECEIVE_USER_INFO: {
      const userInfo = action.options;
      return {...state, ...userInfo};
    }
    case AUTH_USER_SET: {
      const {options} = action;
      return {...state, ...options};
    }

    case CLEAR_AUTH_USER: {
      return {...state, authUser: null};
    }
    case SET_AUTH_USER_INFO: {
      const {options} = action;
      return {...state, authUser: {...state.authUser, ...options}};
    }
    case ERROR_SUBMIT_USER: {
      const {options} = action;
      return {...state, errorUpdateUserMsg: options};
    }
    case SET_USER_ENV: {
      const {options: userEnvId} = action;

      return {...state, userEnvId};
    }
    case SUBMIT_USER_INFO_TO_DB_SUCCESS: {
      // const { options } = action;
      return {
        ...state,
        userInfoExtended: false,
        errorUpdateUserMsg: null
      };
    }
    default:
      return state;
  }
}

export default sessionReducer;
