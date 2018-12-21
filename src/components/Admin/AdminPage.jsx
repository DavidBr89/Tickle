import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import uuidv1 from 'uuid/v1';
import {CloseIcon} from 'Src/styles/menu_icons';
import PreviewCard from 'Components/cards/PreviewCard';
import {SelectInput} from 'Components/utils/SelectField';
import {Link, withRouter} from 'react-router-dom';
import uniq from 'lodash/uniq';
import UserIcon from 'react-feather/dist/icons/user';

import {BlackModal, ModalBody} from 'Components/utils/Modal';

import {SelectTag} from 'Components/utils/SelectField';

import ConnectedCard from 'Cards/ConnectedCard';
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
  const [panelOpen, setPanelOpen] = useState(false);
  const [envName, setEnvName] = useState('');

  const selectedUserEnv = userEnvs.find(d => d.id === userEnvId) || {};
  const {
    name: userEnvName = null,
    id: selectedUserEnvId = null,
  } = selectedUserEnv;

  return (
    <details className={className} panelOpen={panelOpen}>
      <summary
        className={summaryClassName}
        onClick={() => setPanelOpen(!panelOpen)}>
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

const TagSet = ({values, placeholder}) => (
  <div className="flex mt-1">
    {values.length === 0 && (
      <div className="tag-label bg-grey mr-1 mb-1">{placeholder}</div>
    )}
    {values.map(a => (
      <div className="tag-label bg-black mr-1 mb-1">{a}</div>
    ))}
  </div>
);

const RegisterUserForm = ({onSubmit, error, ...usr}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(null);
  const [aims, setAims] = useState([]);
  const [deficits, setDeficits] = useState([]);

  const disabled = email === null;
  return (
    <form
      className="flex-grow flex flex-col"
      onSubmit={e => e.preventDefault()}>
      <div className="flex-grow flex flex-col" style={{flexGrow: 0.6}}>
        <UserIcon className="flex-grow w-auto h-auto" />
      </div>
      <div className="flex flex-none mb-3">
        <input
          value={email}
          className="form-control flex-grow mr-2"
          onChange={event => setEmail(event.target.value)}
          type="email"
          placeholder="email"
        />
        <input
          value={fullName}
          className="form-control flex-grow "
          onChange={event => setFullName(event.target.value)}
          type="text"
          placeholder="First and last name"
        />
      </div>
      <div className="mb-3">
        <SelectTag
          placeholder="Enter Learning Aims"
          inputClassName="flex-grow p-2 border-2 border-black"
          idAcc={d => d.id}
          onChange={newAim => {
            setAims(uniq([...aims, newAim]));
          }}
          values={[{id: 'sports'}, {id: 'yeah'}, {id: 'doooh'}]}
        />
        <TagSet values={aims} placeholder="No aim" />
      </div>
      <div>
        <SelectTag
          btnContent="Add"
          placeholder="Enter Learning deficits"
          inputClassName="z-0 flex-grow p-2 border-2 border-black"
          className=""
          idAcc={d => d.id}
          onChange={newDeficit => setDeficits(uniq([...deficits, newDeficit]))}
          values={[{id: 'sports'}, {id: 'yeah'}, {id: 'doooh'}]}
        />
        <TagSet values={deficits} placeholder="No deficits" />
      </div>
      <div className="mt-auto">
        {error && <div className="alert mb-2">{error.msg}</div>}
        <button
          disabled={disabled}
          type="submit"
          className={`w-full mt-3 btn btn-black ${disabled && 'disabled'}`}
          onClick={() => onSubmit({...usr, aims, deficits, fullName, email})}>
          Create{' '}
        </button>
      </div>
    </form>
  );
};

function UserPanel({
  className,
  selectedUserId,
  onSelectUser,
  userRegErr,
  // registerUserToEnv,
  users,
  userEnvId,
  PreviewCard,
  preRegisterUser,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const [curUserId, setCurUserId] = useState(false);

  const user = users.find(u => u.uid === selectedUserId) || {};
  const {username} = user;

  const envUsers = users.filter(u => u.userEnvIds.includes(userEnvId));

  const baseLiClass = 'cursor-pointer p-2 text-lg';
  const liClass = u =>
    `${baseLiClass} ${u.uid === selectedUserId && 'bg-grey'} ${u.tmp &&
      'bg-green'}`;

  console.log('envUsers', envUsers);
  return (
    <details className={className} panelOpen={panelOpen}>
      <summary
        className={summaryClassName}
        onClick={() => setPanelOpen(!panelOpen)}>
        Users - {username || 'No User selected'}
      </summary>

      <BlackModal visible={modalOpen}>
        <ModalBody title="New User" onClose={() => setModalOpen(false)}>
          <RegisterUserForm
            {...user}
            onSubmit={preRegisterUser}
            error={userRegErr}
          />
        </ModalBody>
      </BlackModal>

      <User {...user} />

      <div className="border overflow-y-auto">
        <div className="flex mt-2 mb-2">
          <div
            className={`${baseLiClass} italic`}
            onClick={() => onSelectUser(null)}>
            All Users
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="ml-1 btn border">
            Add User
          </button>
        </div>
        <div>
          <ul style={{height: 200}}>
            {envUsers.map(u => (
              <li className={liClass(u)} onClick={() => onSelectUser(u.uid)}>
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
  const [cardId, setCardId] = useState(null);
  const selectedCard = cards.find(c => c.id === cardId) || {};

  const [panelOpen, setPanelOpen] = useState(false);

  const h = 10;
  const gridStyle = {
    justifyContent: 'center',
    display: 'grid',
    gridGap: 16,
    // gridAutoFlow: 'column dense',
    gridTemplateColumns: 'repeat(auto-fit, 10rem)',
    gridAutoRows: `minmax(${h}rem, 1fr)`,
    gridTemplateRows: `minmax(${h}rem, 1fr)`,
  };

  return (
    <details className={className} panelOpen={panelOpen}>
      <summary
        className={summaryClassName}
        onClick={() => setPanelOpen(!panelOpen)}>
        Cards
      </summary>
      <div className="flex flex-wrap" style={{...gridStyle}}>
        {cards.map(c => (
          <PreviewCard title={c.title.value} onClick={() => setCardId(c.id)} />
        ))}
      </div>
      <BlackModal visible={cardId !== null}>
        {cardId !== null && <ConnectedCard {...selectedCard} />}
      </BlackModal>
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

  useEffect(() => {
    fetchAllUserEnvs();
    getUsers();
  }, []);

  console.log('userEnvId', userEnvId);
  useEffect(
    () => {
      fetchCards({userEnvId, authorId: selectedUserId, playerId: null});
      // fetchUserIdsFromEnv(userEnvId);
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
        {...props}
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
