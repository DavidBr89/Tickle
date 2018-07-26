import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import withAuthorization from '../withAuthorization';
import AccountPage from './AccountPage';
import * as actions from 'Reducers/Account/actions';
import { changeAuthUserInfo } from 'Reducers/Session/async_actions';

import { makeTagColorScale } from 'Src/styles/GlobalThemeContext'; // eslint-disable-line

/*
exampleAction: authUser => {
    dispatch(setAuthUser(authUser));
  }
*/
const mapStateToProps = state => {
  const { cardSets } = state.Account;
  const tagColorScale = makeTagColorScale(cardSets);
  return {
    ...state.Session.authUser,
    ...state.Account,
    tagColorScale
  };
};
const mapDispatchToProps = dispatch =>
  bindActionCreators({ changeAuthUserInfo, ...actions }, dispatch);

// const mergeProps = (stateProps, dispatchProps, ownProps) => ({
//   ...stateProps,
//   ...ownProps
// });

const authCondition = authUser => authUser !== null;
export default compose(
  withAuthorization(authCondition),
  connect(
    mapStateToProps,
    mapDispatchToProps
    // mergeProps
  )
)(AccountPage);
