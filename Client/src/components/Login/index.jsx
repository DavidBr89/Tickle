// import React from 'react';
import { connect } from 'react-redux';
// import { toggleChallenge } from '../actions';
import { fetchChallenges, screenResize } from './actions';

import Login from './Login';

// Container
const mapStateToProps = state => ({
  ...state.Login
});

const mapDispatchToProps = dispatch => ({
  screenResizeAction: args => {
    dispatch(screenResize(args));
  },
  fetchChallengesAction: () => {
    dispatch(fetchChallenges());
  }
});

const LoginCont = connect(mapStateToProps, mapDispatchToProps)(Login);

export default LoginCont;
