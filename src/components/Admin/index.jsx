import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {compose} from 'recompose';
import {withRouter} from 'react-router-dom';

import {DB} from 'Firebase';
import * as asyncSessionActions from 'Reducers/Session/async_actions';
import * as asyncAdminActions from 'Reducers/Admin/async_actions';
import * as asyncCardActions from 'Reducers/Cards/async_actions';
import * as adminActions from 'Reducers/Admin/actions';

import withAuthorization from 'Src/components/withAuthorization';
import withAuthentication from 'Src/components/withAuthentication';

import {ADMIN} from 'Constants/routeSpec';
import AdminPage from './AdminPage';

const mapStateToProps = state => ({
  ...state.Session,
  ...state.Admin,
  ...state.Cards,
  // userEnvs: state.Session.authUser ? state.Session.authUser.userEnvs : [],
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...asyncSessionActions,
      ...asyncAdminActions,
      ...adminActions,
      ...asyncCardActions,
    },
    dispatch,
  );

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {selectedUserId} = stateProps;

  const {addUserEnv, selectUserEnv, removeUserEnv, fetchUsers} = dispatchProps;

  const {match, history} = ownProps;

  const {
    params: {userEnv},
  } = match;

  const routeUserEnv = env => history.push(`/${env}/${ADMIN.path}`);

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    routeUserEnv,
    selectedUserId,
    userEnv,
    getUsers: () => fetchUsers(userEnv),
    selectedUserEnvId: userEnv,
    addUserEnv: newEnv => addUserEnv({envId: userEnv, newEnv}),
  };
};

export default compose(
  withRouter,
  withAuthentication,
  withAuthorization(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  ),
)(AdminPage);
