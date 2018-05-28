import React from 'react';
import { connect } from 'react-redux';

import { firebase } from 'Firebase';

import {
  fetchReadableCards,
  fetchCreatedCards
} from 'Reducers/Cards/async_actions';

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    componentDidMount() {
      const { onSetAuthUser, getReadableCards, getCreatedCards } = this.props;

      firebase.auth.onAuthStateChanged(authUser => {
        if (authUser) {
          onSetAuthUser(authUser);
          getReadableCards(authUser);
          getCreatedCards(authUser);
        } else {
          onSetAuthUser(null);
        }
      });
    }

    render() {
      return <Component />;
    }
  }

  const mapDispatchToProps = dispatch => ({
    // TODO: import sessionreducer
    onSetAuthUser: authUser => dispatch({ type: 'AUTH_USER_SET', authUser }),
    getReadableCards: authUser => dispatch(fetchReadableCards(authUser.uid)),
    getCreatedCards: authUser => dispatch(fetchCreatedCards(authUser.uid))
  });

  return connect(null, mapDispatchToProps)(WithAuthentication);
};

export default withAuthentication;
