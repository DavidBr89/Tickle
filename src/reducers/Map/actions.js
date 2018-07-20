/*
 * action types
 */

export const RESIZE_CARD_WINDOW = 'RESIZE_CARD_WINDOW';
export const USER_MOVE = 'USER_MOVE';
export const CHANGE_MAP_VIEWPORT = 'CHANGE_MAP_VIEWPORT';
export const SCREEN_RESIZE = 'SCREEN_RESIZE';

// TODO: not used
export const NAVIGATE_APP_FIRST_TIME = 'NAVIGATE_APP_FIRST_TIME';

// export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'

/*
 * other constants
 */

// export const VisibilityFilters = {
//   SHOW_ALL: 'SHOW_ALL',
//   SHOW_COMPLETED: 'SHOW_COMPLETED',
//   SHOW_ACTIVE: 'SHOW_ACTIVE'
// }

/*
 * action creators
 */

export function resizeCardWindow(options) {
  return { type: RESIZE_CARD_WINDOW, options };
}

export function userMove(options) {
  return { type: USER_MOVE, options };
}

export function changeMapViewport(options) {
  return { type: CHANGE_MAP_VIEWPORT, options };
}

// export function clickCard(options) {
//   return { type: CLICK_CARD, options };
// }

// export function screenResize(options) {
//   return { type: SCREEN_RESIZE, options };
// }

// TODO: remove
export function navigateAppFirstTime(options) {
  return { type: NAVIGATE_APP_FIRST_TIME, options };
}

export const FLY_TO_USER = 'FLY_TO_USER';
export function flyToUser(options) {
  return { type: FLY_TO_USER, options };
}

export const CHANGE_VIEWPORT = 'CHANGE_VIEWPORT';
export function changeViewport(options) {
  return { type: CHANGE_VIEWPORT, options };
}

export const TOGGLE_TAG_LIST = 'TOGGLE_TAG_LIST';
export function toggleTagList(options) {
  return { type: TOGGLE_TAG_LIST, options };
}

export const ROUTE = 'ROUTE';
export function routing(options) {
  return { type: ROUTE, options };
}

// export const RECEIVE_PLACES = 'RECEIVE_PLACES';
// export function receivePlaces(options) {
//   return { type: RECEIVE_PLACES, options };
// }

// export const RECEIVE_CARDS = 'RECEIVE_CARDS';
// export function receiveCards(options) {
//   return { type: RECEIVE_CARDS, options };
// }
//
// export const RECEIVE_AUTHORED_CARDS = 'RECEIVE_AUTHORED_CARDS';
// export function receiveAuthoredCards(options) {
//   return { type: RECEIVE_AUTHORED_CARDS, options };
// }
