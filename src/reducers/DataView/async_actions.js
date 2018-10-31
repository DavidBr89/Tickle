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
  flipped = null
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
  return function(dispatch) {
    dispatch(selectCard(null));
    if (filterSet.includes(tag)) dispatch(removeCardFilter(tag));
    else dispatch(addCardFilter(tag));
  };
}

export const routeSelectCard = ({
  match: {url},
  history,
  selectedCardId
}) => dispatch => {
  console.log('url', url);
  const {params} = matchPath(url, {path});

  history.push(constructPath({...params, selectedCardId})); //
  // dispatch(selectCard(id));
};

export const routeExtendCard = ({
  match: {url},
  history,
  extended
}) => dispatch => {
  const {params} = matchPath(url, {path});

  history.push(
    constructPath({...params, extended: extended ? 'extended' : null}),
  );
  // dispatch(extendSelectedCard(id));
};

export const routeLockedCard = ({path, history, id}) => dispatch => {
  history.push(`${path}/${id}/locked`);
  // dispatch(extendSelectedCard(id));
};

export const routeFlipCard = ({match: {url}, history}) => dispatch => {
  const {params} = matchPath(url, {path});
  history.push(constructPath({...params, flipped: !params.flipped}));
  // dispatch(flipCard(!flipped));
};
