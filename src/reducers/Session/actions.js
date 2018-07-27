export const AUTH_USER_SET = 'AUTH_USER_SET';
export function setAuthUser(options) {
  return { type: AUTH_USER_SET, options };
}

export const SET_AUTH_USER_INFO = 'SET_AUTH_USER_INFO';
export function setAuthUserInfo(options) {
  return { type: SET_AUTH_USER_INFO, options };
}

export const SUBMIT_USER_INFO_TO_DB_SUCCESS =
  'SUBMIT_USER_INFO_TO_DB_SUCCESS';
export function submitUserInfoToDBSuccess(options) {
  return { type: SUBMIT_USER_INFO_TO_DB_SUCCESS, options };
}

export const UPDATE_USER_PERSONAL_INFO = 'UPDATE_PERSONAL_INFO';
export function updatePersonalInfo(options) {
  return { type: UPDATE_USER_PERSONAL_INFO, options };
}

export const SET_USERS = 'SET_USERS';
export function setUsers(options) {
  return { type: SET_USERS, options };
}
