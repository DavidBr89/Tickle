import {
  SET_TAG_TREE,
  // SET_DEVICE
} from './actions';

const treeData = {
  id: 'Top Level',
  children: [
    {
      id: 'Level 2: A',
      children: [
        {id: 'Son of A', children: []},
        {id: 'Daughter of A', children: []},
      ],
    },
    {
      id: 'Daughter of A',
      children: [{id: 'lisa', children: []}, {id: 'gisela', children: []}],
    },
    {
      id: 'Son of A',
      children: [{id: 'jan', children: []}, {id: 'nils', children: []}],
    },
    {id: 'Daughter of A', children: []},
    {
      id: 'Level 2: B',
      children: [
        {id: 'Son of A', children: []},
        {id: 'Daughter of A', children: []},
      ],
    },
  ],
};

const deStratified = [
  {id: 'Top Level', parent: null},
  {id: 'Level 2: A', parent: 'Top Level'},
  {id: 'Daughter of A', parent: 'Top Level'},
  {id: 'Son of A', parent: 'Top Level'},
  {id: 'Level 2: B', parent: 'Top Level'},
  {id: 'lisa', parent: 'Daughter of A'},
  {id: 'gisela', parent: 'Daughter of A'},
  {id: 'jan', parent: 'Son of A'},
  {id: 'nils', parent: 'Son of A'},
];

const INITIAL_STATE = {
  tagTree: deStratified,
};

export default function tagTreeReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_TAG_TREE: {
      const tagTree = action.options;
      return {...state, tagTree};
    }
    default:
      return state;
  }
}
