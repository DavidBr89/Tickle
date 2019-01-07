import React from 'react';
// import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';

import {compose} from 'recompose';
import {withRouter} from 'react-router-dom';

import {firebase} from 'Firebase';

import * as cardActions from 'Reducers/Cards/async_actions';

import * as sessionAsyncActions from 'Reducers/Session/async_actions';
import * as sessionActions from 'Reducers/Session/actions';
import {bindActionCreators} from 'redux';

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    componentDidMount() {
      const {
        clearAuthUser,
        fetchCollectibleCards,
        fetchUserInfo,
        match,
      } = this.props;

      const {userEnv} = match.params;

      firebase.auth.onAuthStateChanged(authUser => {
        if (authUser !== null) {

          fetchUserInfo()
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
    authUser: state.Session.authUser,
  });

  const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
  });

  const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(
      {
        ...sessionAsyncActions,
        ...sessionActions,
        ...cardActions,
      },
      dispatch,
    ),
  });

  return compose(
    withRouter,
    connect(
      mapStateToProps,
      mapDispatchToProps,
      mergeProps,
    ),
  )(WithAuthentication);
};

export default withAuthentication;
