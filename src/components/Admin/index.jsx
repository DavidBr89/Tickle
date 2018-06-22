// import React from 'react';

import { connect } from 'react-redux';
import { compose } from 'recompose';

import withAuthorization from '../withAuthorization';
import AdminPage from './AdminPage';

const authCondition = authUser => !!authUser; // && authUser.role === 'ADMIN';

const mapStateToProps = state => ({
  authUser: state.Session
});


export default compose(
  withAuthorization(authCondition),
  connect(mapStateToProps)
)(AdminPage);
