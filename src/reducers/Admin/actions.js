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
