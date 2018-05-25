export const RECEIVE_PLACES = 'RECEIVE_PLACES';
export function receivePlaces(options) {
  return { type: RECEIVE_PLACES, options };
}

export const RECEIVE_CARDS = 'RECEIVE_CARDS';
export function receiveCards(options) {
  return { type: RECEIVE_CARDS, options };
}

export const RECEIVE_AUTHORED_CARDS = 'RECEIVE_AUTHORED_CARDS';
export function receiveAuthoredCards(options) {
  return { type: RECEIVE_AUTHORED_CARDS, options };
}

export const UPDATE_CARD = 'UPDATE_CARD';
export function updateCard(options) {
  return { type: UPDATE_CARD, options };
}

export const CREATE_CARD = 'CREATE_CARD';
export function createCard(options) {
  return { type: CREATE_CARD, options };
}

