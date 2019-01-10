import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {compose} from 'recompose';

import withAuthorization from '../withAuthorization';
import withAuthentication from '../withAuthentication';

import AccountPage from './AccountPage';
import {submitUserInfoToDB} from 'Reducers/Session/async_actions';

import {uniq} from 'lodash';

import * as sessionThunks from 'Reducers/Session/async_actions';

import * as actions from 'Reducers/Session/actions';
import {screenResize} from 'Reducers/Screen/actions';

import {
  isChallengeSucceeded,
  isChallengeStarted,
  isChallengeSubmitted,
} from 'Constants/cardFields';

const isDefined = a => a !== null && a !== undefined;
/*
exampleAction: authUser => {
    dispatch(setAuthUser(authUser));
  }
*/
const mapStateToProps = ({Session:{authUser}}) => ({authUser});

const mapDispatchToProps = dispatch => bindActionCreators(sessionThunks, dispatch);

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {authUser} = stateProps;

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
  };
};

const authCondition = authUser => authUser !== null;
export default compose(
  withAuthorization(authCondition),
  withAuthentication,
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  ),
)(AccountPage);
