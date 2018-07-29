import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import withAuthorization from '../withAuthorization';
import AccountPage from './AccountPage';
import { submitUserInfoToDB } from 'Reducers/Session/async_actions';
import * as actions from 'Reducers/Session/actions';
import { screenResize } from 'Reducers/Screen/actions';

import { makeTagColorScale } from 'Src/styles/GlobalThemeContext'; // eslint-disable-line

/*
exampleAction: authUser => {
    dispatch(setAuthUser(authUser));
  }
*/
const mapStateToProps = state => {
  const { cardSets } = state.Account;
  const { tagColorScale } = state.Cards;
  // const tagColorScale = makeTagColorScale(cardSets);
  return {
    authUser: state.Session.authUser,
    ...state.Screen,
    tagColorScale
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { submitUserInfoToDB, screenResize, ...actions },
    dispatch
  );

// const mergeProps = (stateProps, dispatchProps) => {
//   const { authUser } = stateProps;
//
//   const { submitUserInfoToDB } = dispatchProps;
//
//   // const changeUserInfoDB =
//
//   // const changeUserInfo = ()
//
//   return { ...stateProps, ...dispatchProps, submitChangeUserInfo };
// };

const authCondition = authUser => authUser !== null;
export default compose(
  withAuthorization(authCondition),
  connect(
    mapStateToProps,
    mapDispatchToProps
    // mergeProps
  )
)(AccountPage);
