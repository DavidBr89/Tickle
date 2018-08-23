// import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import {
  fetchUsers,
  fetchCreatedCards,
  asyncSubmitChallengeReview
} from 'Reducers/Admin/async_actions';

// TODO: change later
import * as adminActions from 'Reducers/Admin/actions';
import { fetchAllCards } from 'Reducers/Cards/async_actions';

import withAuthorization from '../withAuthorization';
import AdminPage from './AdminPage';

const mapStateToProps = state => {
  const { selectedUserId, cards } = state.Admin;
  // console.log('selectedUserId', cards, selectedUserId);
  const filteredCards = cards
    .map(c => ({
      ...c,
      challengeSubmission:
        c.challengeSubmissions.find(
          s => s.playerId === selectedUserId && s.completed
        ) || null
    }))
    .filter(c => c.challengeSubmission !== null);

  console.log('filteredCards', filteredCards);

  return {
    // ...state.Session,
    ...state.DataView,
    ...state.Admin,
    cards: filteredCards
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...adminActions,
      fetchUsers,
      fetchCreatedCards,
      fetchAllCards,
      submitChallengeReview: asyncSubmitChallengeReview
    },
    dispatch
  );

const authCondition = authUser => authUser !== null;

export default compose(
  withAuthorization(authCondition),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AdminPage);
