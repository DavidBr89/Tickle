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
  ...state.Cards,
  ...state.Admin,
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
  const {selectedUserId, users, envUserIds, cards,userEnvs} = stateProps;

  const {
    createNewUserEnv,
    selectUserEnv,
    removeUserEnv,
    fetchUsers,
    registerUserToEnv,
  } = dispatchProps;

  const {match, history} = ownProps;

  const {
    params: {userEnv: userEnvId},
  } = match;

  const routeUserEnv = env => history.push(`/${env}/${ADMIN.path}`);

  console.log('envUserIds', envUserIds);
  return {
    ...stateProps,
    cards,
    ...dispatchProps,
    ...ownProps,
    routeUserEnv,
    selectedUserId,
    // nonEnvUsers,
    userEnvs,
    userEnvId,
    getUsers: () => fetchUsers(userEnvId),
    selectedUserEnvId: userEnvId,
    registerUserToEnv: uid => registerUserToEnv({userEnvId, uid}),
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
