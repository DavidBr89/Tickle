import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {compose} from 'recompose';

import withAuthorization from '../withAuthorization';
import withAuthentication from '../withAuthentication';

import AccountPage from './AccountPage';
import {submitUserInfoToDB} from '~/reducers/Session/async_actions';

import * as sessionThunks from '~/reducers/Session/async_actions';

import * as actions from '~/reducers/Session/actions';
import {screenResize} from '~/reducers/Screen/actions';

import {
  isChallengeSucceeded,
  isChallengeStarted,
  isChallengeSubmitted
} from '~/constants/cardFields';

const isDefined = a => a !== null && a !== undefined;
/*
exampleAction: authUser => {
    dispatch(setAuthUser(authUser));
  }
*/
const mapStateToProps = ({Session: {authUser}}) => ({authUser});

const mapDispatchToProps = dispatch =>
  bindActionCreators(sessionThunks, dispatch);

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {authUser} = stateProps;

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps
  };
};

const authCondition = authUser => authUser !== null;
export default compose(
  withAuthorization(authCondition),
  withAuthentication,
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )
)(AccountPage);
