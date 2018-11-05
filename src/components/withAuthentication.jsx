import React from 'react';
// import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';

import {compose} from 'recompose';
import {withRouter} from 'react-router-dom';

import {firebase} from 'Firebase';

import {
  fetchCollectibleCards,
  fetchCreatedCards
} from 'Reducers/Cards/async_actions';

import * as asyncActions from 'Reducers/Session/async_actions';
import {bindActionCreators} from 'redux';

import {setAuthUserInfo} from 'Reducers/Session/actions';
import {nonAuthRoutes} from 'Constants/routeSpec';

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    state = {authUser: null};
    componentDidMount() {
      const {
        setAuthUserInfo,
        getCreatedCards,
        fetchCollectibleCards,
        fetchCreatedCards,
        selectUserEnv,
        authUser,
        history,
        fetchUserInfo,
        match
      } = this.props;

      const {userEnv} = match.params;
      console.log('params', match);

      firebase.auth.onAuthStateChanged(authUser => {
        const userSourceEnv = sessionStorage.getItem('userSourceEnv');
        console.log('userSourceEnv', userSourceEnv);
        if (authUser !== null) {
          const {uid} = authUser;

          //  var displayName = user.displayName;
          // var email = user.email;
          // var emailVerified = user.emailVerified;
          // var photoURL = user.photoURL;
          // var isAnonymous = user.isAnonymous;
          // var uid = user.uid;
          // var providerData = user.providerData;

          // fetchUserInfo({uid, userEnv: userSourceEnv});

          fetchCollectibleCards({userEnv, uid});
          fetchCreatedCards({userEnv, uid});
          // selectUserEnv(userEnv);
        } else {
          setAuthUserInfo({authUser: null});
          history.push(nonAuthRoutes.SIGN_IN.path);
        }
        // this.setState({authUser});
      });
    }

    // componentDidUpdate(prevProps, prevState) {
    //   const {authUser} = this.props;
    //
    //   // if (authUser === null) history.push(nonAuthRoutes.SIGN_IN);
    // }

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
        ...asyncActions,
        fetchCollectibleCards,
        fetchCreatedCards,
        setAuthUserInfo
      },
      dispatch,
    )
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
