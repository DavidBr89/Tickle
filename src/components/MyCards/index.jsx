import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { range } from 'd3';
import { uniq } from 'lodash';

import CardGrid from './AnimatedGrid';

import { selectCardType } from 'Reducers/Diary/actions';

import {
  isChallengeStarted,
  isChallengeSubmitted,
  isChallengeSucceeded
} from 'Constants/cardFields';

const mapStateToProps = state => {
  const { cardSets } = state.Account;
  const { tagColorScale, collectibleCards } = state.Cards;
  const { filterByCardType } = state.Diary;
  // console.log('cards');
  //
  // const tagColorScale = makeTagColorScale(cardSets);
  //
  //
  const cards = collectibleCards.filter(filterByCardType);

  const userTags = uniq(
    collectibleCards.reduce((acc, c) => [...acc, ...c.tags], [])
  );

  return {
    authUser: {
      ...state.Session.authUser
    },
    cards,
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
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      selectCardType
    },
    dispatch
  );

const mergeProps = (stateProps, dispatchProps, ownProps) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null
)(CardGrid);
