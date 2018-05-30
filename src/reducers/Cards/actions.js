export const RECEIVE_PLACES = 'RECEIVE_PLACES';
export function receivePlaces(options) {
  return { type: RECEIVE_PLACES, options };
}

export const RECEIVE_READABLE_CARDS = 'RECEIVE_READABLE_CARDS';
export function receiveReadableCards(options) {
  return { type: RECEIVE_READABLE_CARDS, options };
}

export const RECEIVE_CREATED_CARDS = 'RECEIVE_CREATED_CARDS';
export function receiveCreatedCards(options) {
  return { type: RECEIVE_CREATED_CARDS, options };
}

export const RECEIVE_CARD_TEMPLATES = 'RECEIVE_CARD_TEMPLATES';
export function receiveCardTemplates(options) {
  return { type: RECEIVE_CARD_TEMPLATES, options };
}

export const UPDATE_CARD = 'UPDATE_CARD';
export function updateCard(options) {
  return { type: UPDATE_CARD, options };
}
export const SUCCESS_UPDATE_CARD = 'SUCCESS_UPDATE_CARD';
export function updateCardSuccess(options) {
  return { type: SUCCESS_UPDATE_CARD, options };
}
export const ERROR_UPDATE_CARD = 'ERROR_UPDATE_CARD';
export function updateCardError(options) {
  return { type: ERROR_UPDATE_CARD, options };
}

export const CREATE_CARD = 'CREATE_CARD';
export function createCard(options) {
  return { type: CREATE_CARD, options };
}

export const SUCCESS_CREATE_CARD = 'SUCCESS_CREATE_CARD';
export function createCardSuccess(options) {
  return { type: SUCCESS_CREATE_CARD, options };
}

export const ERROR_CREATE_CARD = 'ERROR_CREATE_CARD';
export function createCardError(options) {
  return { type: ERROR_CREATE_CARD, options };
}

export const DELETE_CARD = 'DELETE_CARD';
export function deleteCard(options) {
  return { type: DELETE_CARD, options };
}

export const SUCCESS_DELETE_CARD = 'SUCCESS_DELETE_CARD';
export function deleteCardSuccess(options) {
  return { type: SUCCESS_DELETE_CARD, options };
}

export const ERROR_DELETE_CARD = 'ERROR_DELETE_CARD';
export function deleteCardError(options) {
  return { type: ERROR_DELETE_CARD, options };
}

export const UPDATE_CARD_TEMPLATE = 'UPDATE_CARD_TEMPLATE';
export function updateCardTemplate(options) {
  return { type: UPDATE_CARD_TEMPLATE, options };
}

export const SELECT_CARD = 'SELECT_CARD';
export function selectCard(options) {
  return { type: SELECT_CARD, options };
}

export const EXTEND_SELECTED_CARD = 'EXTEND_SELECTED_CARD';
export function extendSelectedCard(options) {
  return { type: EXTEND_SELECTED_CARD, options };
}

export const TOGGLE_CARD_AUTHORING = 'TOGGLE_CARD_AUTHORING';
export function toggleCardAuthoring(options) {
  return { type: TOGGLE_CARD_AUTHORING, options };
}

export const TOGGLE_SEARCH = 'TOGGLE_SEARCH';
export function toggleSearch(options) {
  return { type: TOGGLE_SEARCH, options };
}

export const DRAG_CARD = 'DRAG_CARD';
export function dragCard(options) {
  return { type: DRAG_CARD, options };
}

// TODO: rename
export const TOGGLE_TSNE_VIEW = 'TSNE_VIEW';
export function toggleTsneView(options) {
  return { type: TOGGLE_TSNE_VIEW, options };
}

export const TOGGLE_CARD_CHALLENGE = 'TOGGLE_CARD_CHALLENGE';
export function toggleCardChallenge(options) {
  return { type: TOGGLE_CARD_CHALLENGE, options };
}
