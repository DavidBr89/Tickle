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

import {
  isChallengeStarted,
  isChallengeSubmitted,
  isChallengeSucceeded
} from 'Constants/cardFields';

import withAuthorization from 'Components/withAuthorization';

const mapStateToProps = state => {
  // const { cardSets } = state.Account;
  const { tagColorScale, collectibleCards } = state.Cards;
  const { isSelectedCardType } = state.Diary;
  // console.log('cards');
  //
  // const tagColorScale = makeTagColorScale(cardSets);
  //
  //
  const cards = collectibleCards.sort((a, b) => {
    if (isSelectedCardType(a)) return -1;
    if (isSelectedCardType(b)) return 1;
    return 0;
  });

  const userTags = uniq(
    collectibleCards.reduce((acc, c) => [...acc, ...c.tags], [])
  );

  console.log('State Diary', cards);

  return {
    authUser: {
      ...state.Session.authUser
    },
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
  const { match, history, id } = ownProps;
  const { cards, userTags } = stateProps;

  const { routeSelectCard, routeExtendCard } = dispatchProps;
  // console.log('match', match, history, id);

  const { path } = match;
  const { selectedCardId, extended, flipped } = match.params;

  const cardAction = d => {
    selectedCardId === d.id
      ? _ => _
      : routeSelectCard({
        path,
          history,
        id: d.id
        });
  };

  const selectedCard = cards.find(c => c.id === selectedCardId) || null;
  console.log('SelectedCard', selectedCard);
  const selectedTags = selectedCard ? selectedCard.tags : userTags;
  const nbs =
    selectedCardId !== null
      ? cards.filter(c => intersection(c.tags, selectedTags).length !== 0)
      : [];

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    selectedCardId: selectedCardId ? selectedCardId : null,
    cardAction,
    selectedCard,
    selectedTags,
    cards: [...nbs]
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
