import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import uuidv1 from 'uuid/v1';
import {CloseIcon} from 'Src/styles/menu_icons';
import PreviewCard from 'Components/cards/PreviewCard';
import SelectField from 'Components/utils/SelectField';
import User from './User';

const detailsClassName = 'shadow text-2xl p-2 mb-3 border-2 border-black';
const summaryClassName = 'mb-3';

const SelectUserEnv = ({
  className,
  addUserEnvId,
  userEnvs,
  routeUserEnv,
  removeUserEnv,
  selectedUserEnvId,
}) => {
  const [open, setOpen] = useState(false);
  const [envName, setEnvName] = useState('');

  return (
    <details className={className} open={open}>
      <summary className={summaryClassName} onClick={() => setOpen(!open)}>
        Select User Env: {selectedUserEnvId}
      </summary>
      <form
        className="flex justify-between mb-3"
        onSubmit={e => {
          e.preventDefault();
          addUserEnvId({id: uuidv1(), name: envName});
        }}>
        <input
          className="border-2 text-lg"
          style={{flexGrow: 0.75}}
          value={envName}
          placeholder="Add a card environment for your users"
          onChange={e => setEnvName({envName: e.target.value})}
        />
        <button
          type="submit"
          className="ml-2 p-2 border"
          style={{flexGrow: 0.25}}>
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

function SelectUser({className, selectedUserId, onSelectUser, users}) {
  const [open, setOpen] = useState(false);

  const user = users.find(u => u.uid === selectedUserId) || {};
  const {username} = user;
  const aciveClass = uid => uid === selectedUserId && 'bg-grey';

  // console.log('users', users, 'userId', selectedUserId, 'user', user);

  return (
    <details className={className} open={open}>
      <summary className={summaryClassName} onClick={() => setOpen(!open)}>
        Users - {username || 'No User selected'}
      </summary>
      <User {...user} />

      <form
        className="flex mt-2"
        onSubmit={e => {
          e.preventDefault();
          console.log('add user');
        }}>
        <SelectField
          className="border p-2"
          style={{flex: 0.75}}
          idAcc={d => d.uid}
          values={users}
          placeholder={<div>No User selected</div>}
          ChildComp={({username}) => <div>{username}</div>}
        />
        <button className="ml-1 btn" type="submit" style={{flex: 0.25}}>
          Add
        </button>
      </form>

      <div className="mt-3 overflow-y-auto">
        <ul className="border" style={{height: 200}}>
          {users.map(u => (
            <li
              className={`p-2 text-lg ${aciveClass(u.uid)}`}
              onClick={() => onSelectUser(u.uid)}>
              {u.username}
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}

function SelectCards(props) {
  const {className, cards} = props;

  const [open, setOpen] = useState(false);

  return (
    <details className={className} open={open}>
      <summary className={summaryClassName} onClick={() => setOpen(!open)}>
        {' '}
        Cards
      </summary>
      <div className="flex flex-wrap">
        {cards.map(c => (
          <PreviewCard title={c.title.value} />
        ))}
      </div>
    </details>
  );
}
export default function UserEnvironmentSettings(props) {
  const {
    authUser,

    addUserEnv,

    removeUserEnv,
    selectUserEnv,
    // userEnvs,
    selectedUserEnvId,
    routeUserEnv,
    getUsers,
    users,
    userEnv,
    fetchAllUserEnvs,
    selectUser,
    selectedUserId,
    collectibleCards,
    fetchCollectibleCards,
    fetchCreatedCards,
  } = props;

  const {uid} = authUser;
  useEffect(() => {
    getUsers();
  }, selectedUserEnvId);

  useEffect(() => {
    fetchAllUserEnvs();
  }, []);

  useEffect(() => {
    fetchCollectibleCards({userEnv, uid});
    fetchCreatedCards({userEnv, uid});
  }, userEnv);

  return (
    <div className="content-margin">
      <h1 className="mb-3">User Environments</h1>
      <SelectUserEnv className={detailsClassName} {...props} />
      <SelectUser
        className={detailsClassName}
        selectedUserId={selectedUserId}
        users={users}
        onSelectUser={selectUser}
      />
      <SelectCards
        className={detailsClassName}
        cards={collectibleCards || []}
      />
    </div>
  );
}
