import React from 'react';
// import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {firebase} from 'Firebase';

import {fetchCollectibleCards} from 'Reducers/Cards/async_actions';

import {fetchUserInfo} from 'Reducers/Session/async_actions';
import {setAuthUser} from 'Reducers/Session/actions';
import {nonAuthRoutes} from 'Constants/routeSpec';

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    componentDidMount() {
      const {
        onSetAuthUser,
        getCreatedCards,
        fetchCollectibleCards,
        authUser
      } = this.props;

      if (authUser === null) history.push(nonAuthRoutes.SIGN_IN);
      firebase.auth.onAuthStateChanged(authUser => {
        if (authUser) {
          const {uid} = authUser;
          fetchUserInfo(uid);

          //TODO: remove
          fetchCollectibleCards(uid);
        } else {
          onSetAuthUser({authUser: null});

          history.push(nonAuthRoutes.SIGN_IN);
        }
      });
    }

    componentDidUpdate(prevProps, prevState) {
      const {authUser} = this.props;

      if (authUser === null) history.push(nonAuthRoutes.SIGN_IN);
    }

    render() {
      return <Component {...this.props} />;
    }
  }

  const mapStateToProps = state => ({...state.Session.authUser});

  const mergeProps = (stateProps, dispatchProps, ownProps) => {
    console.log('ownProps', stateProps, dispatchProps, ownProps);
    return {
      ...stateProps,
      ...dispatchProps,
      ...ownProps
    };
  };

  const mapDispatchToProps = dispatch => ({
    // TODO: import sessionreducer
    onSetAuthUser: authUser => {
      dispatch(setAuthUser(authUser));
    },
    fetchUserInfo: uid => dispatch(fetchUserInfo(uid)),
    fetchCollectibleCards: uid => dispatch(fetchCollectibleCards(uid))
    // getReadableCards: uid => dispatch(fetchReadableCards(uid)),
    // getCreatedCards: uid => dispatch(fetchCreatedCards(uid))
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(WithAuthentication);
};

export default withAuthentication;
