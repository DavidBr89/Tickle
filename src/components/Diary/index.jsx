// import React from 'react';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';

// import { range } from 'd3';
// import intersection from 'lodash/intersection';
import uniq from 'lodash/uniq';

import cardRoutes from 'Src/Routes/cardRoutes';

import * as diaryActions from 'Reducers/Diary/actions';

import * as dataViewActions from 'Reducers/DataView/async_actions';

import { challengeTypeMap, isCardSeen } from 'Constants/cardFields';

import {
  isChallengeStarted,
  isChallengeSubmitted,
  isChallengeSucceeded
} from 'Constants/cardFields';

import withAuthorization from 'Components/withAuthorization';
import withAuthentication from 'Components/withAuthentication';
import DiaryPage from './DiaryPage';

const mapStateToProps = (state) => {
  // const { cardSets } = state.Account;
  const { tagColorScale, tagVocabulary, collectibleCards } = state.Cards;
  const { selectedCardType } = state.Diary;
  // console.log('cards');
  //
  // const tagColorScale = makeTagColorScale(cardSets);
  //
  //
  const cards = collectibleCards
    .map(d => ({ ...d, seen: true }))
    .filter(challengeTypeMap[selectedCardType]);

  const numSeenCards = cards.filter(c => c.seen).length;
  const numCollectibleCards = collectibleCards.length;

  //   .sort((a, b) => {
  //   if (isSelectedCardType(a)) return -1;
  //   if (isSelectedCardType(b)) return 1;
  //   return 0;
  // });

  const userTags = uniq(
    collectibleCards.reduce((acc, c) => [...acc, ...c.tags], [])
  );

  return {
    ...state.Session,
    tagVocabulary,
    selectedCardType,
    numSeenCards,
    numCollectibleCards,
    cards,
    userTags,
    ...state.Cards,
    ...state.Screen,
    ...state.Diary
  };
};

/*
exampleAction: authUser => {
    dispatch(setAuthUser(authUser));
  }
*/
const mapDispatchToProps = dispatch => bindActionCreators({ ...diaryActions, ...dataViewActions }, dispatch);

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { match, history, location } = ownProps;
  const { path } = match;
  const { collectibleCards: cards, tagVocabulary } = stateProps;

  const {
    query: { selectedCardId, extended, flipped },
    routing: { routeSelectCard, routeExtendCard }
  } = cardRoutes({ history, location });
  // console.log('match', match, history, id);

  const selectedCard = cards.find(c => c.id === selectedCardId) || null;
  const selectedTags = selectedCard !== null
    ? selectedCard.tags.map(t => tagVocabulary.find(d => d.tag === t))
    : [];

  const relatedTags = selectedTags
    .map(t => tagVocabulary.find(d => d.tags.includes(t.tag)))
    .filter(t => !selectedTags.map(d => d.tag).includes(t.tag));

  const includesSelectedCard = cards.filter(d => d.id !== null && d.id === selectedCardId).length === 1;

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    selectedCardId: selectedCardId || null,
    selectedTags,
    relatedTags,
    selectedCard: includesSelectedCard ? selectedCard : null,
    cardExtended: includesSelectedCard && extended,
    cards: cards.sort((a, b) => {
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;
      return 0;
    })
  };
};

const authCondition = authUser => authUser !== null;

export default compose(
  withRouter,
  withAuthorization(authCondition),
  withAuthentication,
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )
)(DiaryPage);
