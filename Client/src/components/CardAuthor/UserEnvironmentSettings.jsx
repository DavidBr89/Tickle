import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {compose} from 'recompose';
import {withRouter} from 'react-router-dom';

import {DB} from 'Firebase';
import * as asyncSessionActions from 'Reducers/Session/async_actions';
import * as asyncAdminActions from 'Reducers/Admin/async_actions';

import withAuthorization from 'Src/components/withAuthorization';
import withAuthentication from 'Src/components/withAuthentication.jsx';

import {CloseIcon} from 'Src/styles/menu_icons';

import {AUTHOR} from 'Constants/routeSpec';

const summaryClassName = 'text-2xl p-2 mb-3 border';
const SelectUserEnv = ({
  addUserEnvId,
  userEnvs,
  routeUserEnv,
  removeUserEnv,
  selectedUserEnvId,
}) => {
  const [envName, setEnvName] = useState('');

  return (
    <details>
      <summary className={summaryClassName}>
        Select User Env: {selectedUserEnvId}
      </summary>
      <form
        className="flex justify-between mb-3"
        onSubmit={e => {
          e.preventDefault();
          addUserEnvId({id: envName});
        }}>
        <input
          className="form-control text-xl"
          style={{flexGrow: 0.75}}
          value={envName}
          placeholder="Add a card environment for your users"
          onChange={e => setEnvName({envName: e.target.value})}
        />
        <button type="submit" className="ml-2 btn" style={{flexGrow: 0.25}}>
          Add
        </button>
      </form>
      <ul className="list-reset">
        {userEnvs.map(d => (
          <li
            onClick={() => routeUserEnv(d.id)}
            className={`cursor-pointer flex text-xl border mb-1 justify-between p-2 ${selectedUserEnvId ===
              d.id && 'bg-grey'}`}>
            <div>{d.id}</div>
            <CloseIcon
              onClick={e => {
                e.stopPropagation();
                removeUserEnv(d);
              }}
            />
          </li>
        ))}
      </ul>
    </details>
  );
};

function SelectUser({className, users = []}) {
  const [user, setUser] = useState(null);

  return (
    <details className={className}>
      <summary className={summaryClassName}>Users - </summary>

      <div className="overflow-y-auto">
        <ul style={{height: 200}}>
          {users.map(u => (
            <li className="text-lg">{u.username}</li>
          ))}
        </ul>
      </div>
    </details>
  );
}

function UserEnvironmentSettings(props) {
  const {
    authUser,
    addUserEnv,
    removeUserEnv,
    selectUserEnv,
    userEnvs,
    selectedUserEnvId,
    routeUserEnv,
    readUsers,
    users,
  } = props;

  useEffect(() => {
    readUsers();
  }, []);

  return (
    <div className="content-margin">
      <h1 className="mb-3">User Environments</h1>
      <SelectUserEnv {...props} />
      <SelectUser className="mt-3" users={users} />
    </div>
  );
}

const mapStateToProps = state => ({
  ...state.Session,
  ...state.Admin,
  userEnvs: state.Session.authUser ? state.Session.authUser.userEnvs : [],
});

/*
exampleAction: authUser => {
    dispatch(setAuthUser(authUser));
  }
*/
const mapDispatchToProps = dispatch =>
  bindActionCreators({...asyncSessionActions, ...asyncAdminActions}, dispatch);

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {addUserEnv, selectUserEnv, removeUserEnv, fetchUsers} = dispatchProps;

  const {match, history} = ownProps;

  const {
    params: {userEnv},
  } = match;

  const routeUserEnv = env => history.push(`/${env}/${AUTHOR.path}`);

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    routeUserEnv,
    readUsers: () => fetchUsers(userEnv),
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
)(UserEnvironmentSettings);
