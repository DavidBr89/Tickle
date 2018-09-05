import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import { firebase } from '../firebase';
import * as routes from '../constants/routes';

import { setAuthUser } from 'Reducers/Session/actions';

const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {
    state = {};
    componentDidMount() {
      const { onSetAuthUser } = this.props;
      firebase.auth.onAuthStateChanged(authUser => {
        if (!condition(authUser)) {
          onSetAuthUser(null);
          this.props.history.push(routes.SIGN_IN);
        } else {
          onSetAuthUser({ authUser });
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
    onSetAuthUser: authUser => {
      dispatch(setAuthUser(authUser));
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
