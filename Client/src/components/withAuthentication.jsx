import React from 'react';
import {connect} from 'react-redux';

import {compose} from 'recompose';
import {withRouter} from 'react-router-dom';

import {firebase} from '~/firebase';

import * as cardActions from '~/reducers/Cards/async_actions';

import * as sessionAsyncActions from '~/reducers/Session/async_actions';
import * as sessionActions from '~/reducers/Session/actions';
import {bindActionCreators} from 'redux';

/**
 * Authentication Higher Order Component to implement a Session
 */
const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    componentDidMount() {
      const {
        clearAuthUser,
        fetchCollectibleCards,
        fetchUserInfo,
        match
      } = this.props;

      const {userEnv} = match.params;

      firebase.auth.onAuthStateChanged(authUser => {
        if (authUser !== null) {
          fetchUserInfo();
          // TODO
          // const {uid} = authUser;
          // fetchCollectibleCards({userEnv, uid});
          // fetchCreatedCards({userEnv, uid});
        } else {
          clearAuthUser();
        }
      });
    }

    render() {
      return <Component {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    authUser: state.Session.authUser
  });

  const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps
  });

  const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(
      {
        ...sessionAsyncActions,
        ...sessionActions,
        ...cardActions
      },
      dispatch
    )
  });

  return compose(
    withRouter,
    connect(
      mapStateToProps,
      mapDispatchToProps,
      mergeProps
    )
  )(WithAuthentication);
};

export default withAuthentication;
