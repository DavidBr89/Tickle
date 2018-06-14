// import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  resizeCardWindow,
  userMove,
  changeMapViewport,
  screenResize,
  changeViewport
} from 'Reducers/Map/actions';

import * as cardActions from 'Reducers/Cards/actions';

import * as asyncActions from 'Reducers/Cards/async_actions';
import * as dataViewActions from 'Reducers/DataView/actions';

// import { fetchDirection } from 'Reducers/Map/async_actions';

import MapView from './MapView';

// import mapViewReducer from './reducer';

console.log('asyncActions', asyncActions);
// Container
const mapStateToProps = state => {
  const {
    readableCards,
    createdCards,
    selectedCardId,
    cardTemplateId,
    tmpCard
  } = state.Cards;

  // TODO: own dim reducer
  const { width, height } = state.MapView;

  const { userLocation } = state.MapView;

  const { authEnv, searchString } = state.DataView;

  // const { userLocation } = state.MapView;

  // console.log('cardTemplate', cardTemplate);
  //
  const defaultCardTemplate = {
    id: cardTemplateId,
    template: true,
    loc: userLocation,
    edit: true,
    tags: [],
    challenge: null,
    floorLoc: { x: width / 2, y: height / 2 }
  };
  const templateCard = {
    ...defaultCardTemplate,
    ...tmpCard,
    tags: tmpCard.tags || []
  };

  const cards = (authEnv
    ? [...createdCards, templateCard]
    : readableCards
  ).filter(c => searchString === null || c.title === searchString);

  console.log('cards', cards);

  // TODO: simplify
  const { uid } =
    state.Session.authUser !== null ? state.Session.authUser : { uid: null };

  const selectedCard =
    selectedCardId !== null ? cards.find(d => d.id === selectedCardId) : null;

  return {
    // TODO: make more specific
    ...state.MapView,
    ...state.Cards,
    ...state.DataView,
    selectedCard,
    selectedCardId,
    cards,
    uid
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...cardActions,
      ...asyncActions,
      ...dataViewActions,
      resizeCardWindow,
      userMove,
      changeMapViewport,
      screenResize,
      changeViewport
    },
    dispatch
  );

// });

const mergeProps = (state, dispatcherProps) => {
  const { selectedCardId, mapViewport, dataView, uid } = state;

  const {
    updateCard,
    updateCardTemplate,
    asyncCreateCard,
    asyncRemoveCard,
    toggleDataView
  } = dispatcherProps;

  const onCardDrop = cardData =>
    selectedCardId === 'temp'
      ? updateCardTemplate({ uid, cardData, mapViewport, dataView })
      : updateCard({ uid, cardData, mapViewport, dataView });

  const cardAction = cardData =>
    selectedCardId === 'temp'
      ? asyncCreateCard({ uid, cardData, mapViewport, dataView })
      : asyncRemoveCard({ uid, cid: cardData.id });

  const onCardUpdate = cardData =>
    cardData.template
      ? updateCardTemplate({ cardData, mapViewport, dataView })
      : updateCard({ uid, cardData, mapViewport, dataView });

  // TODO: change
  const setDataView = toggleDataView;

  return {
    ...state,
    ...dispatcherProps,
    onCardDrop,
    onCardUpdate,
    cardAction,
    setDataView
  };
};

const MapViewCont = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(MapView);

export default MapViewCont;
