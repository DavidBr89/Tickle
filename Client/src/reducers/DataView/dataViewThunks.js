import {addCardFilter, removeCardFilter} from './actions';

/**
 * Dispatcher the right redux action for filtering cards based on topics
 * @param {array} set of topic id strings
 * @param {string} topic id
 * @returns {function} dispatches the right redux action
 */
export function topicFilter({filterSet, topic}) {
  return function(dispatch) {
    if (filterSet.includes(topic)) dispatch(removeCardFilter(topic));
    else dispatch(addCardFilter(topic));
  };
}
