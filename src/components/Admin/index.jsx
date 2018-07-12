// import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { fetchUsers, fetchCreatedCards } from 'Reducers/Admin/async_actions';

import withAuthorization from '../withAuthorization';
import AdminPage from './AdminPage';


const mapStateToProps = state => ({
  // ...state.Session,
  ...state.Admin
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchUsers,
      fetchCreatedCards
    },
    dispatch
  );

const authCondition = authUser => { return authUser !== null; };

export default compose(
  withAuthorization(authCondition),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AdminPage);
