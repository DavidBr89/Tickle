// import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { fetchUsers, fetchCreatedCards } from 'Reducers/Admin/async_actions';

// TODO: change later
import {toggleModal} from 'Reducers/Admin/actions';
import { selectCard } from 'Reducers/DataView/actions';

import withAuthorization from '../withAuthorization';
import AdminPage from './AdminPage';

const mapStateToProps = state => ({
  // ...state.Session,
  ...state.Admin,
  ...state.DataView
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      toggleModal,
      fetchUsers,
      fetchCreatedCards,
      selectCard
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
