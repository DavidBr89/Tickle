// import React from 'react';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';

import { range } from 'd3';
import { uniq, intersection } from 'lodash';

import CardGrid from './AnimatedGrid';

import * as diaryActions from 'Reducers/Diary/actions';

import * as dataViewActions from 'Reducers/DataView/async_actions';

import { challengeTypeMap, isCardSeen } from 'Constants/cardFields';

import {
  isChallengeStarted,
  isChallengeSubmitted,
  isChallengeSucceeded
} from 'Constants/cardFields';

import withAuthorization from 'Components/withAuthorization';

const mapStateToProps = state => {
  // const { cardSets } = state.Account;
  const { tagColorScale, collectibleCards } = state.Cards;
  const { selectedCardType } = state.Diary;
  // console.log('cards');
  //
  // const tagColorScale = makeTagColorScale(cardSets);
  //
  //
  const cards = collectibleCards
    .map(d => {
      const seen = isCardSeen(d);
      return { ...d, seen };
    })
    .filter(challengeTypeMap[selectedCardType]);

  const numSeenCards = cards.filter(c => c.seen).length;
  const numCollectibleCards = collectibleCards.length;

  console.log(' Cards', cards);
  //   .sort((a, b) => {
  //   if (isSelectedCardType(a)) return -1;
  //   if (isSelectedCardType(b)) return 1;
  //   return 0;
  // });

  const userTags = uniq(
    collectibleCards.reduce((acc, c) => [...acc, ...c.tags], [])
  );

  console.log('State Diary', cards);

  return {
    authUser: {
      ...state.Session.authUser
    },
    selectedCardType,
    numSeenCards,
    numCollectibleCards,
    cards,
    userTags,
    ...state.Screen,
    tagColorScale,
    ...state.Diary
  };
};

/*
exampleAction: authUser => {
    dispatch(setAuthUser(authUser));
  }
*/
const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...diaryActions, ...dataViewActions }, dispatch);

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { match, history } = ownProps;
  const { cards } = stateProps;

  const { routeSelectCard, routeExtendCard } = dispatchProps;
  // console.log('match', match, history, id);

  const { path } = match;
  const {
    selectedCardId = null,
    showOption = null
    // flipped = null
  } = match.params;
  const extended = showOption === 'extended';

  const cardAction = d => {
    // TODO: change later
    routeSelectCard({ path, history, id: d.id });
    routeExtendCard({ path, history, id: d.id, extended: !extended });
  };

  const selectedCard = cards.find(c => c.id === selectedCardId) || null;

  const includesSelectedCard =
    cards.filter(d => d.id !== null && d.id === selectedCardId).length === 1;

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    selectedCardId: selectedCardId || null,
    cardAction,
    selectedTags: [],
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
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )
)(CardGrid);
