import React from 'react';
// import { bindActionCreators } from 'redux';
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
        // TODO: rename
        fetchUserInfo
      } = this.props;

      firebase.auth.onAuthStateChanged(authUser => {
        if (authUser) {
          const {uid} = authUser;
          // const userProfile = authUser.providerData[0]:
          // console.log('authenticated', authUser.providerData[0]);
          // onSetAuthUser(authUser.providerData);
          getReadableCards(uid);
          getCreatedCards(uid);
          fetchUserInfo(uid);
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
    fetchUserInfo: uid => dispatch(fetchUserInfo(uid)),
    getReadableCards: uid => dispatch(fetchReadableCards(uid)),
    getCreatedCards: uid => dispatch(fetchCreatedCards(uid))
  });

  return connect(
    null,
    mapDispatchToProps
  )(WithAuthentication);
};

export default withAuthentication;
