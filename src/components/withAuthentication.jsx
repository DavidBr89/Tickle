import React from 'react';
// import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {firebase} from 'Firebase';

import {fetchCollectibleCards} from 'Reducers/Cards/async_actions';

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
        authUser,
        fetchUserInfo
      } = this.props;

      firebase.auth.onAuthStateChanged(authUser => {
        console.log('authUser Changed', authUser);
        if (authUser !== null) {
          const {uid} = authUser;
          fetchUserInfo(uid);

          fetchCollectibleCards(uid);
        } else {
          setAuthUserInfo({authUser: null});

          // history.push(nonAuthRoutes.SIGN_IN);
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
      {...asyncActions, fetchCollectibleCards, setAuthUserInfo},
      dispatch,
    )
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(WithAuthentication);
};

export default withAuthentication;
