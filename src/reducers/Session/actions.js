export const AUTH_USER_SET = 'AUTH_USER_SET';
export function setAuthUser(options) {
  return { type: AUTH_USER_SET, options };
}

export const SET_AUTH_USER_INFO = 'SET_AUTH_USER_INFO';
export function setAuthUserInfo(options) {
  return { type: SET_AUTH_USER_INFO, options };
}
