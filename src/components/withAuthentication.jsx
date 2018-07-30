import React from 'react';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { firebase } from 'Firebase';

import { fetchAllCards } from 'Reducers/Cards/async_actions';

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
          const { uid } = authUser;
          // const userProfile = authUser.providerData[0]:
          // console.log('authenticated', authUser.providerData[0]);
          // console.log('authUser', uid);
          // onSetAuthUser({ uid });
          // TODO: change
          // TODO: change
          // TODO: change
          // TODO: change
          // TODO: change
          // getReadableCards(uid);
          // getCreatedCards(uid);
          fetchUserInfo(uid);
          fetchAllCards(uid);
        } else {
          onSetAuthUser({ authUser: null });
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
    fetchUserInfo: uid => dispatch(fetchUserInfo(uid))
    // getReadableCards: uid => dispatch(fetchReadableCards(uid)),
    // getCreatedCards: uid => dispatch(fetchCreatedCards(uid))
  });

  return connect(
    null,
    mapDispatchToProps,
    mergeProps
  )(WithAuthentication);
};

export default withAuthentication;
