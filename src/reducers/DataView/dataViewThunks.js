import {
  selectCard,
  extendSelectedCard,
  addCardFilter,
  removeCardFilter,
  flipCard,
} from './actions';

export function tagFilter({filterSet, tag}) {
  return function(dispatch) {
    if (filterSet.includes(tag)) dispatch(removeCardFilter(tag));
    else dispatch(addCardFilter(tag));
  };
}
