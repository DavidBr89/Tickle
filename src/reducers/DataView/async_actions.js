// import queryString from 'query-string';
import {
  selectCard,
  extendSelectedCard,
  addCardFilter,
  removeCardFilter,
  flipCard
} from './actions';

// import { matchPath } from 'react-router-dom';

const getBasePath = url => url.slice(0, url.indexOf('/:'));

export function tagFilter({ filterSet, tag }) {
  return function(dispatch) {
    dispatch(selectCard(null));
    if (filterSet.includes(tag)) dispatch(removeCardFilter(tag));
    else dispatch(addCardFilter(tag));
  };
}

export const routeSelectCard = ({ path, history, id }) => dispatch => {
  history.push(`${getBasePath(path)}/${id !== null ? id : ''}`); //
  dispatch(selectCard(id));
};

export const routeExtendCard = ({
  path,
  history,
  id,
  extended
}) => dispatch => {
  const bp = getBasePath(path);
  history.push(`${bp}/${id}/${extended ? 'extended' : ''}`);
  dispatch(extendSelectedCard(id));
};

export const routeLockedCard = ({ path, history, id }) => dispatch => {
  history.push(`${getBasePath(path)}/${id}/locked`);
  // dispatch(extendSelectedCard(id));
};

export const routeFlipCard = ({ match, history }) => dispatch => {
  const { path } = match;
  const bp = getBasePath(path);
  console.log('FLIP', bp, match, history);
  const { selectedCardId, showOption, flipped } = match.params;
  console.log('PARAMS', match.params);

  history.push(
    `${bp}/${selectedCardId}/${showOption}/${!flipped ? 'flipped' : ''}`
  );
  dispatch(flipCard(!flipped));
};
