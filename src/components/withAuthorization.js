import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import { firebase } from '../firebase';
import * as routes from 'Constants/routeSpec';

import { fetchUserInfo } from 'Reducers/Session/async_actions';

const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {
    state = {};
    componentDidMount() {
      const { onSetAuthUser } = this.props;
      firebase.auth.onAuthStateChanged(authUser => {
        if (!condition(authUser)) {
          onSetAuthUser(null);
          this.props.history.push(routes.SIGN_IN.path);
        } else {
          console.log('authUser UID', authUser);
          onSetAuthUser(authUser.uid);
          // this.setState({ authUser });
        }
      });
    }

    render() {
      return this.props.authUser ? (
        <Component {...this.props} />
      ) : (
        <div>No access</div>
      );
    }
  }

  const mapStateToProps = state => ({
    authUser: state.Session.authUser
  });

  const mapDispatchToProps = dispatch => ({
    onSetAuthUser: uid => {
      dispatch(fetchUserInfo(uid));
    }
  });

  const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps
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
