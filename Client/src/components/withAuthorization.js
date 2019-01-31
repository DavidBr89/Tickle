import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {withRouter} from 'react-router-dom';

import * as asyncActions from '~/reducers/Session/async_actions';

const withAuthorization = (
  condition = authUser => !!authUser
) => Component => {
  class WithAuthorization extends React.Component {
    state = {};

    componentDidMount() {
      const {match, history} = this.props;
      const {params} = match;
      const {userEnv} = params;
      const {authUser} = this.props;

      if (!condition(authUser)) history.push(`/${userEnv}/signin`);
    }

    componentDidUpdate(prevProps, prevState) {
      const {authUser, history, match} = this.props;

      const {params} = match;
      const {userEnv} = params;

      if (!condition(authUser)) history.push(`/${userEnv}/signin`);
    }

    render() {
      const {authUser} = this.props;
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
      mergeProps
    )
  )(WithAuthorization);
};

export default withAuthorization;
