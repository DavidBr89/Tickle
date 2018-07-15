// import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';

import { intersection } from 'lodash';
import {
  resizeCardWindow,
  userMove,
  changeViewport
} from 'Reducers/Map/actions';

import setify from 'Utils/setify';

import { screenResize } from 'Reducers/Screen/actions';
import * as cardActions from 'Reducers/Cards/actions';

import * as asyncActions from 'Reducers/Cards/async_actions';
import * as dataViewActions from 'Reducers/DataView/actions';

// import { fetchDirection } from 'Reducers/Map/async_actions';

import MapViewPage from './MapViewPage';

import withAuthorization from '../withAuthorization';

// import mapViewReducer from './reducer';

// Container
const mapStateToProps = state => {
  const { readableCards, createdCards, cardTemplateId, tmpCard } = state.Cards;

  const { selectedCardId, filterSet } = state.DataView;

  // TODO: own dim reducer
  const { width, height, userLocation } = state.MapView;

  const { authEnv } = state.DataView;
  const {
    authUser: { uid, username }
  } = state.Session;

  // const { userLocation } = state.MapView;

  const templateCard = {
    ...tmpCard,
    uid,
    tags: tmpCard.tags.length > 0 ? tmpCard.tags : [username]
  };

  const cards = authEnv ? [templateCard, ...createdCards] : createdCards;
  const filteredCards = cards.filter(
    d =>
      filterSet.length === 0 ||
      intersection(d.tags, filterSet).length === filterSet.length
  );
  const cardSets = setify(filteredCards);
  const selectedCard = filteredCards.find(d => d.id === selectedCardId) || null;

  const selectedTags = selectedCard !== null ? selectedCard.tags : filterSet;

  return {
    // TODO: make more specific
    ...state.MapView,
    ...state.Cards,
    ...state.DataView,
    uid,
    selectedCard,
    selectedTags,
    selectedCardId,
    cardSets,
    filterSet,
    // selectedTags,
    cards: filteredCards
    // authUser
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
      screenResize,
      changeViewport
    },
    dispatch
  );

// });

const mergeProps = (state, dispatcherProps) => {
  const { selectedCardId, uid } = state;
  const {
    selectCard,
    extendSelectedCard,
    fetchReadableCards,
    fetchCreatedCards
  } = dispatcherProps;

  const previewCardAction = d =>
    selectedCardId === d.id ? extendSelectedCard(d.id) : selectCard(d.id);

  const fetchCards = () => {
    // fetchReadableCards(uid);
    fetchCreatedCards(uid);
  };

  return {
    ...state,
    ...dispatcherProps,
    previewCardAction,
    fetchCards
  };
};

const authCondition = authUser => authUser !== null;

export default compose(
  withAuthorization(authCondition),
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )
)(MapViewPage);
