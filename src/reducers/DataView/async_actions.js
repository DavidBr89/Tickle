// import queryString from 'query-string';
import {
  selectCard,
  extendSelectedCard,
  addCardFilter,
  removeCardFilter,
  flipCard
} from './actions';

const getBasePath = url => url.slice(0, url.indexOf('/:'));

export function tagFilter({ filterSet, tag }) {
  return function(dispatch) {
    dispatch(selectCard(null));
    if (filterSet.includes(tag)) dispatch(removeCardFilter(tag));
    else dispatch(addCardFilter(tag));
  };
}

export const routeSelectCard = ({ path, history, id }) => dispatch => {
  console.log('history', history, 'path', path);
  history.push(`${getBasePath(path)}/${id}`); //
  dispatch(selectCard(id));
};

export const routeExtendCard = ({
  path,
  history,
  id,
  extended
}) => dispatch => {
  history.push(`${getBasePath(path)}/${id}/${extended ? 'extended' : ''}`);
  dispatch(extendSelectedCard(id));
};

export const routeFlipCard = ({ match, history }) => dispatch => {
  const { path } = match;
  const { selectedCardId, extended, flipped } = match.params;

  history.push(
    `${getBasePath(path)}/${selectedCardId}/${extended}/${
      !flipped ? 'flipped' : ''
    }`
  );
  dispatch(flipCard(!flipped));
};
