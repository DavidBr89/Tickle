// import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

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
import * as dataViewAsyncActions from 'Reducers/DataView/async_actions';

import withAuthorization from 'Src/components/withAuthorization';

import {
  CHALLENGE_SUBMITTED,
  isChallengeSubmitted
} from 'Constants/cardFields';

import CardViewPage from './CardViewPage';
// import mapViewReducer from './reducer';

const lowercase = s => s.toLowerCase();
const filterByTag = (doc, filterSet) =>
  filterSet.length === 0 ||
  intersection(doc.tags.map(lowercase), filterSet.map(lowercase)).length ===
    filterSet.length;

// const applyFilter = challengeState => d => {
//   if (challengeState === CHALLENGE_SUBMITTED) return isChallengeSubmitted(d);
//   return !isChallengeSubmitted(d);
// };

// Container
const mapStateToProps = state => {
  console.log('new Action', 'yeah');
  const { collectibleCards } = state.Cards;

  const {
    // selectedCardId,
    filterSet,
    cardPanelVisible
    // challengeStateFilter
  } = state.DataView;

  // TODO: own dim reducer
  const { width, height, userLocation } = state.MapView;

  // const { authEnv } = state.DataView;
  const {
    authUser: { uid }
  } = state.Session;

  // TODO: make more specific
  return {
    ...state.MapView,
    ...state.DataView,
    uid,
    // selectedCardId,
    filterSet,
    collectibleCards,
    cardPanelVisible,
    ...state.Cards,
    ...state.Screen
    // cards: filteredCards
    // cardSets,
    // selectedTags,
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
      changeViewport,
      ...dataViewAsyncActions
    },
    dispatch
  );

// });

const mergeProps = (state, dispatcherProps, ownProps) => {
  const { uid, collectibleCards, filterSet } = state;
  const { dataView, history, match } = ownProps;
  const { path } = match;
  const selectedCardId = match.params.selectedCardId || null;
  const extCardId =
    match.params.extended === 'extended' ? selectedCardId : null;

  console.log('match', match);

  // const selectedCardId = selectedCardIds;
  const {
    selectCard,
    routeExtendCard,
    routeSelectCard,
    // fetchAllCards,
    // fetchReadableCards,
    fetchCollectibleCards
  } = dispatcherProps;

  const previewCardAction = d => {
    selectedCardId === d.id
      ? routeExtendCard({
        path,
        history,
        id: selectedCardId,
        extended: extCardId === null
      })
      : routeSelectCard({
        path,
        history,
        id: d.id
      });
  };

  const fetchCards = () => {
    // TODO
    fetchCollectibleCards(uid);
  };

  const preSelectCardId = () => selectCard(null);

  const filteredCards = collectibleCards.filter(d => filterByTag(d, filterSet));
  // .filter(applyFilter(challengeStateFilter));

  const cardSets = setify(filteredCards);
  const selectedCard = filteredCards.find(d => d.id === selectedCardId) || null;

  const selectedTags = selectedCard !== null ? selectedCard.tags : filterSet;

  return {
    ...state,
    ...dispatcherProps,
    previewCardAction,
    fetchCards,
    preSelectCardId,
    dataView,
    cards: filteredCards,
    cardSets,
    selectedTags,
    selectedCardId,
    extCardId
  };
};

const authCondition = authUser => authUser !== null;

export default compose(
  withAuthorization(authCondition),
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )
)(CardViewPage);
