import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { range } from 'd3';
import { uniq } from 'lodash';

import CardGrid from './AnimatedGrid';

import {
  isChallengeStarted,
  isChallengeSubmitted,
  isChallengeSucceeded
} from 'Constants/cardFields';

const mapStateToProps = state => {
  const { cardSets } = state.Account;
  const { tagColorScale, collectibleCards } = state.Cards;
  // console.log('cards');
  //
  // const tagColorScale = makeTagColorScale(cardSets);
  //
  //
  const collectedCards = collectibleCards.filter(isChallengeSucceeded);

  const submittedCards = collectibleCards.filter(isChallengeSubmitted);

  const startedCards = collectibleCards.filter(isChallengeStarted);
  const succeededCards = collectibleCards.filter(isChallengeSucceeded);

  const userTags = uniq(
    [...collectedCards, ...submittedCards, ...startedCards].reduce(
      (acc, c) => [...acc, ...c.tags],
      []
    )
  );

  return {
    authUser: {
      ...state.Session.authUser
    },
    collectedCards,
    startedCards,
    submittedCards,
    succeededCards,
    userTags,
    ...state.Screen,
    tagColorScale
  };
};

/*
exampleAction: authUser => {
    dispatch(setAuthUser(authUser));
  }
*/
// const mapDispatchToProps = dispatch =>
//   bindActionCreators(
//     {
//       actions
//     },
//     dispatch
//   );

const mergeProps = (stateProps, dispatchProps, ownProps) => ({});

export default connect(
  mapStateToProps,
  null,
  null
)(CardGrid);
