// import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { fetchUsers } from 'Reducers/Admin/async_actions';

import withAuthorization from '../withAuthorization';
import AdminPage from './AdminPage';

const authCondition = authUser => !!authUser; // && authUser.role === 'ADMIN';

const mapStateToProps = state => ({
  authUser: state.Session,
  ...state.Admin
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchUsers
    },
    dispatch
  );

export default compose(
  withAuthorization(authCondition),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AdminPage);
