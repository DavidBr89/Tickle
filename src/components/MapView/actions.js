/*
 * action types
 */

export const SELECT_CARD = 'SELECT_CARD';
export const RESIZE_CARD_WINDOW = 'RESIZE_CARD_WINDOW';
export const USER_MOVE = 'USER_MOVE';
export const CHANGE_MAP_VIEWPORT = 'CHANGE_MAP_VIEWPORT';
export const SCREEN_RESIZE = 'SCREEN_RESIZE';
export const PLAY_CARD_CHALLENGE = 'PLAY_CARD_CHALLENGE ';
export const TOGGLE_CARD_CHALLENGE = 'TOGGLE_CARD_CHALLENGE';
export const EXTEND_SELECTED_CARD = 'EXTEND_SELECTED_CARD';
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

export function extendSelectedCard(options) {
  return { type: EXTEND_SELECTED_CARD, options };
}
export function selectCard(options) {
  return { type: SELECT_CARD, options };
}

export function resizeCardWindow(options) {
  return { type: RESIZE_CARD_WINDOW, options };
}

export function userMove(options) {
  return { type: USER_MOVE, options };
}

export function changeMapViewport(options) {
  return { type: CHANGE_MAP_VIEWPORT, options };
}

export function playCardChallenge(options) {
  return { type: PLAY_CARD_CHALLENGE, options };
}

export function toggleCardChallenge(options) {
  return { type: TOGGLE_CARD_CHALLENGE, options };
}

// export function clickCard(options) {
//   return { type: CLICK_CARD, options };
// }

export function screenResize(options) {
  return { type: SCREEN_RESIZE, options };
}

// TODO: remove
export function navigateAppFirstTime(options) {
  return { type: NAVIGATE_APP_FIRST_TIME, options };
}

export const FLY_TO_USER = 'FLY_TO_USER';
export function flyToUser(options) {
  return { type: FLY_TO_USER, options };
}

export const ROUTING = 'ROUTING';
export function routing(options) {
  return { type: ROUTING, options };
}
