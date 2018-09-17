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
  const { selectedCardId = null, extended, flipped } = match.params;

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
  console.log(
    'cards',
    cards,
    'SelectedCard',
    selectedCard,
    'selectedCardId',
    selectedCardId
  );
  const nbs =
    selectedCard !== null
      ? cards
        .filter(
          c =>
            c.id !== selectedCardId &&
              intersection(c.tags, selectedCard.tags).length !== 0
        )
        .slice(0, 8)
        .concat([selectedCard])
      : [...cards];

  const selectedTags = uniq(
    nbs.reduce((acc, d) => acc.concat([...d.tags]), [])
  );
  console.log('nbs', nbs);
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    selectedCardId: selectedCardId || null,
    cardAction,
    selectedTags,
    selectedCard,
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
