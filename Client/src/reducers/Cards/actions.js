export const RECEIVE_PLACES = 'RECEIVE_PLACES';
export function receivePlaces(options) {
  return {type: RECEIVE_PLACES, options};
}

export const RECEIVE_COLLECTIBLE_CARDS = 'RECEIVE_COLLECTIBLE_CARDS';
export function receiveCollectibleCards(options) {
  return {type: RECEIVE_COLLECTIBLE_CARDS, options};
}

export const RECEIVE_CREATED_CARDS = 'RECEIVE_CREATED_CARDS';
export function receiveCreatedCards(options) {
  return {type: RECEIVE_CREATED_CARDS, options};
}

export const LOADING_CARDS = 'LOADING_CARDS';
export function loadingCards(options) {
  return {type: LOADING_CARDS, options};
}

export const UPDATE_CARD = 'UPDATE_CARD';
export function updateCard(options) {
  return {type: UPDATE_CARD, options};
}

export const CARD_IS_UPDATING = 'CARD_IS_UPDATING';
export function cardIsUpdating(options) {
  return {type: CARD_IS_UPDATING, options};
}
export const SUCCESS_UPDATE_CARD = 'SUCCESS_UPDATE_CARD';
export function updateCardSuccess(options) {
  return {type: SUCCESS_UPDATE_CARD, options};
}
export const ERROR_UPDATE_CARD = 'ERROR_UPDATE_CARD';
export function updateCardError(options) {
  return {type: ERROR_UPDATE_CARD, options};
}

export const CREATE_CARD = 'CREATE_CARD';
export function createCard(options) {
  return {type: CREATE_CARD, options};
}

export const SEE_CARD = 'SEE_CARD';
export function seeCard(options) {
  return {type: SEE_CARD, options};
}

export const SUCCESS_CREATE_CARD = 'SUCCESS_CREATE_CARD';
export function createCardSuccess(options) {
  return {type: SUCCESS_CREATE_CARD, options};
}

export const ERROR_CREATE_CARD = 'ERROR_CREATE_CARD';
export function createCardError(options) {
  return {type: ERROR_CREATE_CARD, options};
}

export const DELETE_CARD = 'DELETE_CARD';
export function deleteCard(options) {
  return {type: DELETE_CARD, options};
}

export const SUCCESS_DELETE_CARD = 'SUCCESS_DELETE_CARD';
export function deleteCardSuccess(options) {
  return {type: SUCCESS_DELETE_CARD, options};
}

export const ERROR_DELETE_CARD = 'ERROR_DELETE_CARD';
export function deleteCardError(options) {
  return {type: ERROR_DELETE_CARD, options};
}

export const UPDATE_CARD_TEMPLATE = 'UPDATE_CARD_TEMPLATE';
export function updateCardTemplate(options) {
  console.log(UPDATE_CARD_TEMPLATE);
  return {type: UPDATE_CARD_TEMPLATE, options};
}

export const SET_DEFAULT_TEMPLATE = 'SET_DEFAULT_TEMPLATE';
export function setDefaultTemplate(options) {
  return {type: SET_DEFAULT_TEMPLATE, options};
}

// export const TOGGLE_CARD_AUTHORING = 'TOGGLE_CARD_AUTHORING';
// export function toggleCardAuthoring(options) {
//   return { type: TOGGLE_CARD_AUTHORING, options };
// }

export const TOGGLE_SEARCH = 'TOGGLE_SEARCH';
export function toggleSearch(options) {
  return {type: TOGGLE_SEARCH, options};
}

export const DRAG_CARD = 'DRAG_CARD';
export function dragCard(options) {
  return {type: DRAG_CARD, options};
}

// TODO: rename
export const TOGGLE_TSNE_VIEW = 'TSNE_VIEW';
export function toggleTsneView(options) {
  return {type: TOGGLE_TSNE_VIEW, options};
}

export const TOGGLE_CARD_CHALLENGE = 'TOGGLE_CARD_CHALLENGE';
export function toggleCardChallenge(options) {
  return {type: TOGGLE_CARD_CHALLENGE, options};
}

export const ADD_COMMENT = 'ADD_COMMENT';
export function addComment(options) {
  return {type: ADD_COMMENT, options};
}

export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export function addCommentSuccess(options) {
  return {type: ADD_COMMENT_SUCCESS, options};
}

export const ADD_COMMENT_ERROR = 'ADD_COMMENT_ERROR';
export function addCommentError(options) {
  return {type: ADD_COMMENT_ERROR, options};
}

export const SUBMIT_CHALLENGE = 'SUBMIT_CHALLENGE';
export function submitActivity(options) {
  return {type: SUBMIT_CHALLENGE, options};
}

export const SUBMIT_CHALLENGE_SUCCESS = 'SUBMIT_CHALLENGE_SUCCESS';
export function submitActivitySuccess(options) {
  return {type: SUBMIT_CHALLENGE_SUCCESS, options};
}

export const SUBMIT_CHALLENGE_FEEDBACK = 'SUBMIT_CHALLENGE_FEEDBACK';
export function submitActivityFeedback(options) {
  return {type: SUBMIT_CHALLENGE_FEEDBACK, options};
}

export const REMOVE_TOPIC = 'ADD_TOPIC';
export function removeTopic(options) {
  return {type: REMOVE_TOPIC, options};
}

export const RECEIVE_TOPICS = 'RECEIVE_TOPICS';
export function receiveTopics(options) {
  return {type: RECEIVE_TOPICS, options};
}

export const PUT_TOPIC = 'PUT_TOPIC';
export function putTopic(options) {
  return {type: PUT_TOPIC, options};
}

// export const TOGGLE_DATA_VIEW = 'TOGGLE_DATA_VIEW';
// export function toggleDataView(options) {
// }
