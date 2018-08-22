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

export const SELECT_USER = 'SELECT_USER';
export function selectUser(options) {
  return { type: SELECT_USER, options };
}

export const EXTEND_SELECTION = 'EXTEND_SELECTION_ADMIN';
export function extendSelection(options) {
  return { type: EXTEND_SELECTION, options };
}

export const SELECT_CARD_ID = 'SELECT_CARD_ID_ADMIN';
export function selectCardId(options) {
  return { type: SELECT_CARD_ID, options };
}

export const SUBMIT_CHALLENGE_REVIEW = 'SUBMIT_CHALLENGE_REVIEW';
export function submitChallengeReview(options) {
  return { type: SUBMIT_CHALLENGE_REVIEW, options };
}

export const SUBMIT_CHALLENGE_REVIEW_SUCCESS =
  'SUBMIT_CHALLENGE_REVIEW_SUCCESS';
export function submitChallengeReviewSuccess(options) {
  return { type: SUBMIT_CHALLENGE_REVIEW_SUCCESS, options };
}

// export const SELECT_CARD = 'SELECT_CARD';
// export function selectCardIndex(options) {
//   return { type: SELECT_CARD_INDEX, options };
// }
