// import React from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {uniqBy} from 'lodash';
import {
  isChallengeStarted,
  isChallengeSucceeded,
  isChallengeSubmitted,
  challengeTypeMap,
  CHALLENGE_STARTED,
  CHALLENGE_SUCCEEDED,
  CHALLENGE_SUBMITTED,
  CARD_CREATED
} from 'Constants/cardFields';

import {
  fetchUsers,
  asyncSubmitActivityReview,
  fetchAllCardsWithSubmissions
} from 'Reducers/Admin/async_actions';

// TODO: change later
import * as adminActions from 'Reducers/Admin/actions';

import withAuthorization from '../withAuthorization';
import AdminPage from './AdminPage';

const mapStateToProps = state => {
  const {
    selectedUserId,
    cardFilters,
    selectedCardId,
    extendedId,
    cards,
    users
  } = state.Admin;
  // const {
  //   authUser: { uid }
  // } = state.Session;
  // console.log('selectedUserId', cards, selectedUserId);

  const selectedUser =
    selectedUserId !== null ? users.find(u => u.uid === selectedUserId) : null;

  const cardsWithSubmission = cards
    .map(c => ({
      ...c,
      challengeSubmission:
        c.allChallengeSubmissions.find(s => s.playerId === selectedUserId) ||
        null
    }))
    .filter(c => c.challengeSubmission !== null);

  const selectedCard =
    extendedId !== null
      ? cardsWithSubmission.find(c => c.id === extendedId)
      : null;

  // const startedCards = cardsWithSubmission.filter(isChallengeStarted);
  // const submittedCards = cardsWithSubmission.filter(isChallengeSubmitted);
  // const succeededCards = cardsWithSubmission.filter(isChallengeSucceeded);

  // const haaike = 'PpNOHOQLtXatZzcaAYVCMQQP5XT2';
  // const filteredCreatedCards = cardsWithSubmission.filter(
  //   d => d.uid === haaike
  // );

  const createdCards = cards.filter(c => c.uid === selectedUserId);

  const cardSets = {
    [CHALLENGE_STARTED]: cardsWithSubmission.filter(
      challengeTypeMap[CHALLENGE_STARTED],
    ),
    [CHALLENGE_SUBMITTED]: cardsWithSubmission.filter(
      challengeTypeMap[CHALLENGE_SUBMITTED],
    ),
    [CHALLENGE_SUCCEEDED]: cardsWithSubmission.filter(
      challengeTypeMap[CHALLENGE_SUCCEEDED],
    )
  };

  console.log('cardSets', cardSets, 'cardFilters');
  const filteredCards = uniqBy(
    cardFilters.reduce(
      (acc, filterStr) => [...acc, ...cardSets[filterStr]],
      [],
    ),
    'id',
  );

  console.log('filteredCards', filteredCards);
  console.log('selectedCard', selectedCard);
  // const routeLockedCard = id =>
  //   otherActions.routeLockedCard({
  //     path,
  //     history,
  //     id
  //   });
  //
  // const routeExtendCard = () =>
  //   otherActions.routeExtendCard({
  //     path,
  //     history,
  //     id: selectedCardId,
  //     extended: extCardId === null
  //   });
  //
  // const routeSelectCard = id =>
  //   otherActions.routeSelectCard({ path, history, id });

  return {
    // ...state.Session,
    ...state.DataView,
    ...state.Admin,
    cards: filteredCards,
    startedCards: cardSets[CHALLENGE_STARTED],
    submittedCards: cardSets[CHALLENGE_SUBMITTED],
    succeededCards: cardSets[CHALLENGE_SUCCEEDED],
    createdCards,
    selectedUser,
    selectedCard
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...adminActions,
      fetchUsers,
      fetchAllCardsWithSubmissions,
      submitActivityReview: asyncSubmitActivityReview
    },
    dispatch,
  );

const authCondition = authUser => authUser !== null;

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {flipped} = stateProps;
  const {flip} = dispatchProps;

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps
  };
};

export default compose(
  withAuthorization(authCondition),
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  ),
)(AdminPage);
