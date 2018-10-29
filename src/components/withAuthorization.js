import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {withRouter} from 'react-router-dom';

import {firebase} from '../firebase';
import * as routes from 'Constants/routeSpec';

import * as asyncActions from 'Reducers/Session/async_actions';

const withAuthorization = (condition = authUser => !!authUser) => Component => {
  class WithAuthorization extends React.Component {
    state = {};
    componentDidMount() {
      const {fetchUserInfo} = this.props;
      firebase.auth.onAuthStateChanged(authUser => {
        if (!condition(authUser)) {
          // fetchUserInfo(null);
          this.props.history.push(routes.SIGN_IN.path);
        } else {
          console.log('User is authorized', authUser.uid);
          // fetchUserInfo(authUser.uid);
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
    ...bindActionCreators(asyncActions, dispatch)
  });

  const mergeProps = (stateProps, dispatchProps, ownProps) =>
  // const {dbEnv} = stateProps;

    ({
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
