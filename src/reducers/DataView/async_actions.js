// import queryString from 'query-string';
import {matchPath} from 'react-router';
import {split} from 'lodash';

import {
  selectCard,
  extendSelectedCard,
  addCardFilter,
  removeCardFilter,
  flipCard,
} from './actions';

const path = `/:userEnv/:dataview/:type/:selectedCardId?/:extended?/:flipped?`;

const constructPath = ({
  userEnv,
  dataview,
  type,
  selectedCardId = null,
  extended = null,
  flipped = null,
}) => {
  const basePath = `/${userEnv}/${dataview}/${type}`;
  if (selectedCardId) {
    if (extended) {
      if (flipped) {
        return `${basePath}/${selectedCardId}/${extended}/${flipped}`;
      }
      return `${basePath}/${selectedCardId}/${extended}`;
    }
    return `${basePath}/${selectedCardId}`;
  }
  return basePath;
};
// import { matchPath } from 'react-router-dom';

const getBasePath = url => {
  const lastIndex = url.lastIndexOf('/');
  const numSlash = split(url, '/').filter(d => d !== '').length;
  // TODO do it better
  return url.slice(0, numSlash > 3 ? lastIndex : Infinity);
};

export function tagFilter({filterSet, tag}) {
  console.log('filterSet', filterSet, 'tag', tag);
  return function(dispatch) {
    dispatch(selectCard(null));
    if (filterSet.includes(tag)) dispatch(removeCardFilter(tag));
    else dispatch(addCardFilter(tag));
  };
}
