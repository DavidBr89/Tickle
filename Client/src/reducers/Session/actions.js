export const AUTH_USER_SET = 'AUTH_USER_SET';
export function setAuthUser(options) {
  return {type: AUTH_USER_SET, options};
}

export const CLEAR_AUTH_USER = 'CLEAR_AUTH_USER';
export function clearAuthUser() {
  return {type: CLEAR_AUTH_USER};
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

export const SET_USER_ENV = 'SET_USER_ENV';
export function setUserEnv(options) {
  return {type: SET_USER_ENV, options};
}

export const SET_USERS = 'SET_USERS';
export function setUsers(options) {
  return {type: SET_USERS, options};
}

export const RECEIVE_USER_INFO = 'RECEIVE_USER_INFO';
export function receiveUserInfo(options) {
  return {type: RECEIVE_USER_INFO, options};
}

export const SET_TAG_TREE_DATA = 'SET_TAG_TREE_DATA';
export function setTagTreeData(options) {
  return {type: SET_TAG_TREE_DATA, options};
}

export const EXTEND_USER_INFO = 'EXTEND_USER_INFO';
export function extendUserInfo(options) {
  return {type: EXTEND_USER_INFO, options};
}
