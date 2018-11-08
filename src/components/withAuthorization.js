import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import { SIGN_IN } from 'Constants/routeSpec';

import * as asyncActions from 'Reducers/Session/async_actions';
import { firebase } from '../firebase';

const withAuthorization = (condition = authUser => !!authUser) => (Component) => {
  class WithAuthorization extends React.Component {
    state = {};

    componentDidMount() {
      const { match, history } = this.props;
      const { params } = match;
      const { userEnv } = params;
      firebase.auth.onAuthStateChanged((authUser) => {
        if (!condition(authUser)) history.push(`/${userEnv}/signin`);
      });
    }

    render() {
      const { authUser } = this.props;
      return authUser ? <Component {...this.props} /> : null;
    }
  }

  const mapStateToProps = state => ({
    authUser: state.Session.authUser,
    userEnv: state.Session.userEnvSelectedId
  });

  const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(asyncActions, dispatch)
  });

  const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps
    // onSetAuthUser
  });

  return compose(
    withRouter,
    connect(
      mapStateToProps,
      mapDispatchToProps,
      mergeProps,
    ),
  )(WithAuthorization);
};

export default withAuthorization;
