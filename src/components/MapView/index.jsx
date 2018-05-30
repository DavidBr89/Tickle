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

import { asyncCreateCard } from 'Reducers/Cards/async_actions';

// import { fetchDirection } from 'Reducers/Map/async_actions';

import MapView from './MapView';

// import mapViewReducer from './reducer';

// Container
const mapStateToProps = state => {
  const {
    readableCards,
    createdCards,
    cardTemplate,
    selectedCardId,
    authEnv
  } = state.Cards;

  // const { userLocation } = state.MapView;

  // console.log('cardTemplate', cardTemplate);
  const cards = authEnv ? [...createdCards, cardTemplate] : readableCards;

  // TODO: simplify
  const { uid } =
    state.Session.authUser !== null ? state.Session.authUser : { uid: null };

  const selectedCard =
    selectedCardId !== null ? cards.find(d => d.id === selectedCardId) : null;

  return {
    // TODO: make more specific
    ...state.MapView,
    ...state.Cards,
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
      asyncCreateCard,
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
  const { selectedCardId, mapViewport, uid } = state;

  const {
    updateCard,
    updateCardTemplate,
    asyncCreateCard: createCard
  } = dispatcherProps;

  const cardAction = selectedCardId === 'temp' ? updateCardTemplate : updateCard;

  const cardDropHandler = cardData =>
    cardAction({ uid, cardData, mapViewport });

  const onCardUpdate = cardData =>
    cardData.template
      ? updateCardTemplate({ cardData, mapViewport })
      : updateCard({ uid, cardData, mapViewport });

  return { ...state, ...dispatcherProps, cardDropHandler, onCardUpdate };
};

const MapViewCont = connect(mapStateToProps, mapDispatchToProps, mergeProps)(
  MapView
);

export default MapViewCont;
