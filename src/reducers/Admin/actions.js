// export function screenResize(options) {
//   return { type: SCREEN_RESIZE, options };
// }
export const RECEIVE_USERS = 'RECEIVE_USERS';
export function receiveUsers(options) {
  return { type: RECEIVE_USERS, options };
}

export const GET_CARDS = 'GET_CARDS';
export function getCards(options) {
  return { type: GET_CARDS, options };
}

export const TOGGLE_MODAL = 'TOGGLE_MODAL';
export function toggleModal(options) {
  return { type: TOGGLE_MODAL, options };
}
// export const SELECT_CARD = 'SELECT_CARD';
// export function selectCardIndex(options) {
//   return { type: SELECT_CARD_INDEX, options };
// }
