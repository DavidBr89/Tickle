// import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { fetchUsers, fetchCreatedCards } from 'Reducers/Admin/async_actions';

// TODO: change later
import * as adminActions from 'Reducers/Admin/actions';
import { fetchAllCards } from 'Reducers/Cards/async_actions';

import withAuthorization from '../withAuthorization';
import AdminPage from './AdminPage';

const mapStateToProps = state => {
  const { selectedUserId, cards } = state.Admin;
  console.log('selectedUserId', cards, selectedUserId);
  const filteredCards = cards.filter(c => {
    console.log(
      'ya',
      c.challengeSubmissions.find(s => s.playerId === selectedUserId)
    );
    return (
      c.challengeSubmissions.find(s => s.playerId === selectedUserId) !==
      undefined
    );
  });
  console.log('filteredCards', filteredCards);
  // console.log(
  //   'filteredCards',
  //   cards.filter(c => c.challengeSubmissions.length > 0)
  // );

  return {
    // ...state.Session,
    ...state.DataView,
    ...state.Admin,
    cards: filteredCards,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...adminActions,
      fetchUsers,
      fetchCreatedCards,
      fetchAllCards
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
