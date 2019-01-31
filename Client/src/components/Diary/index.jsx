// import React from 'react';

import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose} from 'recompose';

// import { range } from 'd3';
// import intersection from 'lodash/intersection';
import uniq from 'lodash/uniq';

import cardRoutes from '~/Routes/cardRoutes';

import * as diaryActions from '~/reducers/Diary/actions';

import * as dataViewActions from '~/reducers/DataView/dataViewThunks';

import {challengeTypeMap, isCardSeen} from '~/constants/cardFields';

import {
  isChallengeStarted,
  isChallengeSubmitted,
  isChallengeSucceeded,
  fallbackTagValues
} from '~/constants/cardFields';

import withAuthorization from '~/components/withAuthorization';
import withAuthentication from '~/components/withAuthentication';
import DiaryPage from './DiaryPage';

const mapStateToProps = state => {
  const {tagVocabulary, collectibleCards} = state.Cards;
  const cards = collectibleCards.map(d => ({...d, seen: true}));

  const numSeenCards = cards.filter(c => c.seen).length;
  const numCollectibleCards = collectibleCards.length;

  const userTags = uniq(
    collectibleCards.reduce(
      (acc, c) => [...acc, ...fallbackTagValues(c.tags)],
      []
    )
  );

  return {
    ...state.Session,
    tagVocabulary,
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
const mapDispatchToProps = dispatch =>
  bindActionCreators({...diaryActions, ...dataViewActions}, dispatch);

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {match, history, location} = ownProps;
  const {path} = match;
  const {collectibleCards: cards, tagVocabulary} = stateProps;

  const {
    query: {selectedCardId, extended, flipped},
    routing: {routeSelectCard, routeExtendCard, routeSelectExtendCard}
  } = cardRoutes({history, location});

  const selectedCard = cards.find(c => c.id === selectedCardId) || null;
  const selectedTags = [];

  const relatedTags = selectedTags
    .map(t => tagVocabulary.find(d => d.tags.includes(t.tag)))
    .filter(t => !selectedTags.map(d => d.tag).includes(t.tag));

  const selectCard = id => {
    routeSelectCard(id);
  };

  const closeCard = () => {
    routeSelectCard(null);
  };

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    selectedCardId: selectedCardId || null,
    selectedTags,
    relatedTags,
    selectedCard,
    cardExtended: selectedCardId !== null,
    selectCard,
    closeCard,
    cards: cards.sort((a, b) => {
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;
      return 0;
    })
  };
};

const authCondition = authUser => authUser !== null;

export default compose(
  withAuthorization(authCondition),
  withAuthentication,
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )
)(DiaryPage);
