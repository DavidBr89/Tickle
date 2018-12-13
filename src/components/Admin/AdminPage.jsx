import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import uuidv1 from 'uuid/v1';
import {CloseIcon} from 'Src/styles/menu_icons';
import PreviewCard from 'Components/cards/PreviewCard';
import {SelectInput} from 'Components/utils/SelectField';
import {Link, withRouter} from 'react-router-dom';
import User from './User';

const detailsClassName = 'shadow text-2xl p-2 mb-5 border-2 border-black';
const summaryClassName = 'mb-3';

const UserEnvPanel = ({
  className,
  createNewUserEnv,
  userEnvs,
  routeUserEnv,
  removeUserEnv,
  title,
  userEnvId,
}) => {
  const [open, setOpen] = useState(false);
  const [envName, setEnvName] = useState('');

  const selectedUserEnv = userEnvs.find(d => d.id === userEnvId) || {};
  const {
    name: userEnvName = null,
    id: selectedUserEnvId = null,
  } = selectedUserEnv;

  return (
    <details className={className} open={open}>
      <summary className={summaryClassName} onClick={() => setOpen(!open)}>
        {`Select User environment ${userEnvName}`}
      </summary>
      <div className="p-2">
        <h3>Create new User Env</h3>
        <form
          className="flex justify-between mb-3"
          onSubmit={e => {
            e.preventDefault();
            createNewUserEnv({id: uuidv1(), name: envName});
          }}>
          <input
            className="border-2 text-lg"
            style={{flexGrow: 0.75}}
            value={envName}
            placeholder="Add a card environment for your users"
            onChange={e => setEnvName(e.target.value)}
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
              <div>{d.name}</div>
              <CloseIcon
                onClick={e => {
                  e.stopPropagation();
                  removeUserEnv(d);
                }}
              />
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Generated Link</h3>
        <Link className="link" to={`/${selectedUserEnvId}`}>
          {selectedUserEnvId}
        </Link>
      </div>
    </details>
  );
};

/*
      <form
        className="flex mt-2 mb-3"
        onSubmit={e => {
          e.preventDefault();
        }}>
        <SelectField
          key={userEnvId}
          className="border p-1"
          style={{flex: 0.75}}
          idAcc={d => d.uid}
          values={nonEnvUsers}
          placeholder={<div>Add user</div>}
          onChange={u => setCurUserId(u.uid)}
          ChildComp={({email}) => <div>{email}</div>}
        />
        <button
          className="ml-1 btn border"
          type="submit"
          style={{flex: 0.25}}
          onClick={() => registerUserToEnv(curUserId)}>
          Add
        </button>
      </form>
  */

function UserPanel({
  className,
  selectedUserId,
  onSelectUser,
  registerUserToEnv,
  users,
  envUserIds,
  userEnvId,
}) {
  const [open, setOpen] = useState(false);

  const [curUserId, setCurUserId] = useState(false);

  const user = users.find(u => u.uid === selectedUserId) || {};
  const {username} = user;

  const envUsers = users.filter(u => envUserIds.includes(u.uid));

  const nonEnvUsers = users.filter(u => !envUserIds.includes(u.uid));

  const aciveClass = uid => uid === selectedUserId && 'bg-grey';
  const liClass = uid => `cursor-pointer p-2 text-lg ${aciveClass(uid)}`;

  return (
    <details className={className} open={open}>
      <summary className={summaryClassName} onClick={() => setOpen(!open)}>
        Users - {username || 'No User selected'}
      </summary>

      <form
        className="flex mt-2 mb-3"
        onSubmit={e => {
          e.preventDefault();
        }}>
        <SelectInput
          placeholder="Select User"
          key={userEnvId}
          className="border p-1"
          inputClassName=""
          style={{flex: 0.75}}
          idAcc={d => d.email}
          values={nonEnvUsers}
          onChange={u => setCurUserId(u.uid)}
        />
        <button
          className="ml-1 btn border"
          type="submit"
          style={{flex: 0.25}}
          onClick={() => registerUserToEnv(curUserId)}>
          Add
        </button>
      </form>
      <User {...user} />

      <div className="border overflow-y-auto">
        <div
          className={`${liClass(null)} mt-3 `}
          onClick={() => onSelectUser(null)}>
          All Users
        </div>
        <div>
          <ul style={{height: 200}}>
            {envUsers.map(u => (
              <li
                className={liClass(u.uid)}
                onClick={() => onSelectUser(u.uid)}>
                {u.email}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </details>
  );
}

function SelectCards(props) {
  const {className, cards} = props;

  const [open, setOpen] = useState(false);

  const h = 10;
  const gridStyle = {
    justifyContent: 'center',
    display: 'grid',
    gridGap: 16,
    // gridAutoFlow: 'column dense',
    gridTemplateColumns: 'repeat(auto-fit, minmax(10vh, 125px))',
    gridAutoRows: `minmax(${h}rem, 2fr)`,
    gridTemplateRows: `minmax(${h}rem, 2fr)`,
  };

  return (
    <details className={className} open={open}>
      <summary className={summaryClassName} onClick={() => setOpen(!open)}>
        Cards
      </summary>
      <div className="flex flex-wrap" style={{...gridStyle}}>
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
    userEnvs,
    selectedUserEnvId,
    routeUserEnv,
    getUsers,
    users,
    userEnvId,
    fetchAllUserEnvs,
    selectUser,
    selectedUsers,
    selectedUserId,
    collectibleCards,
    fetchCards,
    envUserIds,
    fetchUserIdsFromEnv,
    registerUserToEnv,
    cards,
  } = props;

  const {uid} = authUser;

  useEffect(() => {
    fetchAllUserEnvs();
    getUsers();
  }, []);

  console.log('userEnvId', userEnvId);
  useEffect(
    () => {
      fetchCards({userEnvId, authorId: selectedUserId, playerId: null});
      fetchUserIdsFromEnv(userEnvId);
    },
    [userEnvId],
  );

  useEffect(
    () => {
      fetchCards({userEnvId, authorId: selectedUserId, playerId: null});
    },
    [selectedUserId, userEnvId],
  );

  return (
    <div className="content-margin overflow-y-auto">
      <h1 className="mb-3">User Environments</h1>
      <UserEnvPanel className={detailsClassName} {...props} />
      <UserPanel
        userEnvId={userEnvId}
        users={users}
        envUserIds={envUserIds}
        className={detailsClassName}
        selectedUserId={selectedUserId}
        registerUserToEnv={registerUserToEnv}
        onSelectUser={selectUser}
      />
      <SelectCards
        title={`Cards ${userEnvId}`}
        className={detailsClassName}
        cards={cards}
      />
    </div>
  );
}

UserEnvironmentSettings.defaultProps = {
  envUsers: [],
};
