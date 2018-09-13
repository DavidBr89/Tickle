import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { range } from 'd3';
import { uniq } from 'lodash';

import CardGrid from './AnimatedGrid';

import * as diaryActions from 'Reducers/Diary/actions';

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

  console.log('State Diary', state.Diary);
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
  bindActionCreators(diaryActions, dispatch);

const mergeProps = (stateProps, dispatchProps, ownProps) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null
)(CardGrid);
