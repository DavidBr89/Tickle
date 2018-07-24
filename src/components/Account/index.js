import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import withAuthorization from '../withAuthorization';
import Account from './Account';
// import actions from './actions';

const mapStateToProps = state => ({  ...state.Session });

/*
exampleAction: authUser => {
    dispatch(setAuthUser(authUser));
  }
*/
// const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

// const mergeProps = (stateProps, dispatchProps, ownProps) => ({});

const authCondition = authUser => authUser !== null;
export default compose(
  withAuthorization(authCondition),
  connect(mapStateToProps)
)(Account);
