import { push } from 'connected-react-router';
import { selectCard, addCardFilter, removeCardFilter } from './actions';

export function tagFilter({ filterSet, tag }) {
  return function(dispatch) {
    dispatch(selectCard(null));
    if (filterSet.includes(tag)) dispatch(removeCardFilter(tag));
    else dispatch(addCardFilter(tag));
  };
}

export const asyncSelectCard = ({ path, history, id }) => dispatch => {
  history.push(`${path}/${id}`); //
  dispatch(selectCard(id));
};
