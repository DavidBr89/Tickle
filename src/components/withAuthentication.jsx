import React from 'react';
import { connect } from 'react-redux';

import { firebase } from 'Firebase';

import {
  fetchReadableCards,
  fetchCreatedCards
} from 'Reducers/Cards/async_actions';

import { fetchUserInfo } from 'Reducers/Session/async_actions';
import { setAuthUser } from 'Reducers/Session/actions';

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    componentDidMount() {
      const {
        onSetAuthUser,
        getReadableCards,
        getCreatedCards,
        fetchUserInfoXXX
      } = this.props;

      firebase.auth.onAuthStateChanged(authUser => {
        console.log('authenticated', authUser.uid);
        if (authUser) {
          fetchUserInfo(authUser);
          getReadableCards(authUser);
          getCreatedCards(authUser);
          // fetchUserInfo(authUser.uid);
        } else {
          onSetAuthUser({ uid: null });
        }
      });
    }

    // componentDidUpdate(prevProps, prevState) {
    //   this.props.onSetAuthUser('xHmRrkdqetZuOtcksOJoIYUKNmU2');
    // }

    render() {
      return <Component />;
    }
  }

  const mapDispatchToProps = dispatch => ({
    // TODO: import sessionreducer
    onSetAuthUser: authUser => {
      dispatch(setAuthUser(authUser));
    },
    fetchUserInfo: authUser => dispatch(fetchUserInfo(authUser.uid)),
    getReadableCards: authUser => dispatch(fetchReadableCards(authUser.uid)),
    getCreatedCards: authUser => dispatch(fetchCreatedCards(authUser.uid))
  });

  return connect(
    null,
    mapDispatchToProps
  )(WithAuthentication);
};

export default withAuthentication;
