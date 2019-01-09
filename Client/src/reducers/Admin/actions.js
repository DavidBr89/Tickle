// export function screenResize(options) {
//   return { type: SCREEN_RESIZE, options };
// }
export const RECEIVE_USERS = 'RECEIVE_USERS';
export function receiveUsers(options) {
  return {type: RECEIVE_USERS, options};
}

export const GET_CARDS = 'GET_CARDS';
export function getCards(options) {
  return {type: GET_CARDS, options};
}

export const SELECT_USER = 'SELECT_USER';
export function selectUser(options) {
  return {type: SELECT_USER, options};
}

export const RECEIVE_ALL_USER_ENVS = 'RECEIVE_ALL_USER_ENVS';
export function receiveAllUserEnvs(options) {
  return {type: RECEIVE_ALL_USER_ENVS, options};
}

export const SUBMIT_CHALLENGE_REVIEW = 'SUBMIT_CHALLENGE_REVIEW';
export function submitChallengeReview(options) {
  return {type: SUBMIT_CHALLENGE_REVIEW, options};
}

export const INSERT_USER_INTO_ENV = 'INSERT_USER_INTO_ENV';
export function insertUserIntoEnv(options) {
  return {type: INSERT_USER_INTO_ENV, options};
}

export const ADD_USER_ENV = 'ADD_USER_ENV';
export function addUserEnv(options) {
  return {type: ADD_USER_ENV, options};
}

export const ADD_USER = 'ADD_USER';
export function addUser(options) {
  return {type: ADD_USER, options};
}

export const SELECT_USERS_BY_ENV = 'SELECT_USERS_BY_ENV';
export function selectUsersByEnv(options) {
  return {type: SELECT_USERS_BY_ENV, options};
}

export const RECEIVE_CARDS = 'RECEIVE_CARDS';
export function receiveCards(options) {
  return {type: RECEIVE_CARDS, options};
}

export const USER_REGISTRATION_ERROR = 'USER_REGISTRATION_ERROR';
export function userRegistrationError(options) {
  return {type: USER_REGISTRATION_ERROR, options};
}

export const SUBMIT_CHALLENGE_REVIEW_SUCCESS =
  'SUBMIT_CHALLENGE_REVIEW_SUCCESS';
export function submitChallengeReviewSuccess(options) {
  return {type: SUBMIT_CHALLENGE_REVIEW_SUCCESS, options};
}

// export const ADD_USER_ENV = 'ADD_USER_ENV';
// export function changeCardFilter(options) {
//   return {type: ADD_USER_ENV, options};
// }

// export const SELECT_CARD = 'SELECT_CARD';
// export function selectCardIndex(options) {
//   return { type: SELECT_CARD_INDEX, options };
// }
