export const AUTH_USER_SET = 'AUTH_USER_SET';
export function setAuthUser(options) {
  return {type: AUTH_USER_SET, options};
}

export const SET_AUTH_USER_INFO = 'SET_AUTH_USER_INFO';
export function setAuthUserInfo(options) {
  return {type: SET_AUTH_USER_INFO, options};
}

export const SUBMIT_USER_INFO_TO_DB_SUCCESS = 'SUBMIT_USER_INFO_TO_DB_SUCCESS';
export function submitUserInfoToDBSuccess(options) {
  return {type: SUBMIT_USER_INFO_TO_DB_SUCCESS, options};
}

export const ERROR_SUBMIT_USER = 'ERROR_SUBMIT_USER';
export function errorSubmitUser(options) {
  return {type: ERROR_SUBMIT_USER, options};
}

// TODO: rename
export const UPDATE_USER_PERSONAL_INFO = 'UPDATE_PERSONAL_INFO';
export function updatePersonalInfo(options) {
  return {type: UPDATE_USER_PERSONAL_INFO, options};
}

export const SELECT_USER_ENV = 'SELECT_USER_ENV';
export function selectUserEnv(options) {
  return {type: SELECT_USER_ENV, options};
}

export const SET_USERS = 'SET_USERS';
export function setUsers(options) {
  return {type: SET_USERS, options};
}

export const RECEIVE_USER_INFO = 'RECEIVE_USER_INFO';
export function receiveUserInfo(options) {
  return {type: RECEIVE_USER_INFO, options};
}

export const SELECT_CARD_ID = 'SELECT_CARD_ID_ACC';
export function selectCard(options) {
  return {type: SELECT_CARD_ID, options};
}

export const EXTEND_CARD_ID = 'EXTEND_CARD_ID_ACC';
export function extendCard(options) {
  return {type: EXTEND_CARD_ID, options};
}

export const EXTEND_USER_INFO = 'EXTEND_USER_INFO';
export function extendUserInfo(options) {
  return {type: EXTEND_USER_INFO, options};
}
