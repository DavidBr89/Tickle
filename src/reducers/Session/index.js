import {DB} from 'Firebase';

import {
  AUTH_USER_SET,
  SET_AUTH_USER_INFO,
  CLEAR_AUTH_USER,
  ERROR_SUBMIT_USER,
  RECEIVE_USER_INFO,
  SELECT_CARD_ID,
  EXTEND_USER_INFO,
  SUBMIT_USER_INFO_TO_DB_SUCCESS,
  SET_USER_ENV,
  SET_TAG_TREE_DATA,
  // SET_DEVICE
} from './actions';

// const treeData = {
//   id: 'Top Level',
//   children: [
//     {
//       id: 'Level 2: A',
//       title: 'Level 2: A',
//       children: [
//         {id: 'Son of A', children: []},
//         {id: 'Daughter of A', children: []},
//       ],
//     },
//     {
//       id: 'Daughter of A',
//       title: 'Daughter of A',
//       children: [{id: 'lisa', children: []}, {id: 'gisela', children: []}],
//     },
//     {
//       id: 'Son of A',
//       title: 'Son of A',
//       children: [{id: 'jan', children: []}, {id: 'nils', children: []}],
//     },
//     {
//       id: 'Daughter of A',
//       title: 'Daughter of A',
//       children: [],
//     },
//     {
//       id: 'Level 2: B',
//       title: 'Level 2: B',
//       children: [
//         {
//           id: 'son of a',
//           title: 'son of a',
//           children: [],
//         },
//         {
//           id: 'Daughter of A',
//           title: 'Daughter of A',
//           children: [],
//         },
//       ],
//     },
//   ],
// };
//
// const date = new Date();
// const deStratified = [
//   {id: 'Top Level', parent: null, title: 'Top Level', date},
//   {id: 'Level 2: A', parent: 'Top Level', title: 'Level 2: A', date},
//   {id: 'Daughter of A', parent: 'Top Level', title: 'Daughter of A', date},
//   {id: 'Son of A', parent: 'Top Level', title: 'Son of A', date},
//   {id: 'Level 2: B', parent: 'Top Level', title: 'Level 2: B', date},
//   {id: 'lisa', parent: 'Daughter of A', title: 'lisa', date},
//   {id: 'gisela', parent: 'Daughter of A', title: 'gisela', date},
//   {id: 'jan', parent: 'Son of A', title: 'jan', date},
//   {id: 'nils', parent: 'Son of A', title: 'nils', date},
// ];

const INITIAL_STATE = {
  authUser: null,
  cardSets: [],
  cards: [],
  // createdCards: [],
  // submittedCards: [],
  device: {smallScreen: false, iOs: false},
  selectedUserEnvId: 'staging',
  tagTreeData: [],
  globalInterests: []
};

function sessionReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
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
      const {options: selectedUserEnvId} = action;

      return {...state, selectedUserEnvId};
    }
    case SUBMIT_USER_INFO_TO_DB_SUCCESS: {
      // const { options } = action;
      return {...state, userInfoExtended: false, errorUpdateUserMsg: null};
    }
    default:
      return state;
  }
}

export default sessionReducer;
