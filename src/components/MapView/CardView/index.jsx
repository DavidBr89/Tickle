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
// rename path
import { makeTagColorScale } from 'Src/styles/GlobalThemeContext';

import { screenResize } from 'Reducers/Screen/actions';
import * as cardActions from 'Reducers/Cards/actions';

import * as asyncActions from 'Reducers/Cards/async_actions';
import * as dataViewActions from 'Reducers/DataView/actions';

import withAuthorization from 'Src/components/withAuthorization';

import CardViewPage from './CardViewPage';
// import mapViewReducer from './reducer';

// Container
const mapStateToProps = state => {
  const { collectibleCards, createdCards } = state.Cards;

  const { selectedCardId, filterSet } = state.DataView;

  // TODO: own dim reducer
  const { width, height, userLocation } = state.MapView;

  // const { authEnv } = state.DataView;
  const {
    authUser: { uid }
  } = state.Session;

  const filteredCards = collectibleCards.filter(
    d =>
      filterSet.length === 0 ||
      intersection(d.tags, filterSet).length === filterSet.length
  );
  console.log('UPD UPD card to filter', filteredCards);
  const cardSets = setify(filteredCards);
  // const tagColorScale = makeTagColorScale(cardSets);
  const selectedCard = filteredCards.find(d => d.id === selectedCardId) || null;

  const selectedTags = selectedCard !== null ? selectedCard.tags : filterSet;
  return {
    // TODO: make more specific
    ...state.MapView,
    ...state.DataView,
    uid,
    selectedCardId,
    filterSet,
    ...state.Cards,
    cardSets,
    selectedTags,
    ...state.Screen,
    cards: filteredCards
    // tagColorScale
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

const mergeProps = (state, dispatcherProps, ownProps) => {
  const { selectedCardId, uid } = state;
  const {
    selectCard,
    extendSelectedCard,
    // fetchReadableCards,
    fetchCollectibleCards
  } = dispatcherProps;

  const { dataView } = ownProps;

  const previewCardAction = d =>
    selectedCardId === d.id ? extendSelectedCard(d.id) : selectCard(d.id);

  const fetchCards = () => {
    // TODO
    fetchCollectibleCards(uid);
  };

  const preSelectCardId = () => selectCard(null);

  return {
    ...state,
    ...dispatcherProps,
    previewCardAction,
    fetchCards,
    preSelectCardId,
    dataView
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
)(CardViewPage);
