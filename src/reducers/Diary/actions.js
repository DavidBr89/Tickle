export const RECEIVE_USER_INFO = 'RECEIVE_USER_INFO';
export function receiveUserInfo(options) {
  return { type: RECEIVE_USER_INFO, options };
}

export const SELECT_CARD_ID = 'SELECT_CARD_ID';
export function selectCardID(options) {
  return { type: SELECT_CARD_ID, options };
}

export const EXTEND_TAB = 'EXTEND_TAB';

export function extendTab() {
  return { type: EXTEND_TAB };
}

export const EXTEND_USER_INFO = 'EXTEND_USER_INFO';
export function extendUserInfo(options) {
  return { type: EXTEND_USER_INFO, options };
}

export const UPDATE_PERSONAL_INFO = 'UPDATE_PERSONAL_INFO';
export function updatePersonalInfo(options) {
  return { type: UPDATE_PERSONAL_INFO, options };
}

export const SELECT_CARD_TYPE = 'SELECT_CARD_TYPE';
export function selectCardType(options) {
  return { type: SELECT_CARD_TYPE, options };
}
