import {
  selectCard,
  addCardFilter,
  removeCardFilter,
} from './actions';

export function tagFilter({ filterSet, tag }) {
  return function(dispatch) {
    dispatch(selectCard(null));
    if (filterSet.includes(tag)) dispatch(removeCardFilter([tag]));
    else dispatch(addCardFilter([tag]));
  };
}
