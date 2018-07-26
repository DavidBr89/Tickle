export const RECEIVE_USER_INFO = 'RECEIVE_USER_INFO';
export function receiveUserInfo(options) {
  return { type: RECEIVE_USER_INFO, options };
}

export const SELECT_CARD_ID = 'SELECT_CARD_ID_ACC';
export function selectCard(options) {
  return { type: SELECT_CARD_ID, options };
}

export const EXTEND_CARD_ID = 'EXTEND_CARD_ID_ACC';
export function extendCard(options) {
  return { type: EXTEND_CARD_ID, options };
}

export const EXTEND_USER_INFO = 'EXTEND_USER_INFO';
export function extendUserInfo(options) {
  return { type: EXTEND_USER_INFO, options };
}

export const UPDATE_PERSONAL_INFO = 'UPDATE_PERSONAL_INFO';
export function updatePersonalInfo(options) {
  return { type: UPDATE_PERSONAL_INFO, options };
}
