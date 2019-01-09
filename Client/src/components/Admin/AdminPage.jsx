import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import uuidv1 from 'uuid/v1';
import uniq from 'lodash/uniq';
import UserIcon from 'react-feather/dist/icons/user';
import MoreIcon from 'react-feather/dist/icons/more-horizontal';

import cardRoutes from 'Src/Routes/cardRoutes';

import {CloseIcon} from 'Src/styles/menu_icons';
import PreviewCard, {
  PreviewCardSwitch
} from 'Components/cards/PreviewCard';

import {SelectInput} from 'Components/utils/SelectField';
import {Link, withRouter} from 'react-router-dom';
import {TEMP_ID} from 'Constants/cardFields';

import {initCard} from 'Constants/cardFields';

import {BlackModal, ModalBody} from 'Components/utils/Modal';

import {SelectTag} from 'Components/utils/SelectField';

import MetaCard from 'Components/cards';

import {UserPreview, UserDetail, InviteUserForm} from './User';

const detailsClass = 'shadow text-2xl p-2 mb-5 border-2 border-black';
const summaryClass = 'mb-3';

// const listItemClass = 'cursor-pointer flex text-xl border mb-1 justify-between p-2';

const baseLiClass =
  'cursor-pointer p-2 text-lg flex justify-between items-center';

const UserEnvPanel = ({
  className,
  createNewUserEnv,
  userEnvs,
  routeUserEnv,
  removeUserEnv,
  title,
  userEnvId
}) => {
  const [panelOpen, setPanelOpen] = useState(false);
  const [envName, setEnvName] = useState('');

  const selectedUserEnv = userEnvs.find(d => d.id === userEnvId) || {};
  const {
    name: userEnvName = null,
    id: selectedUserEnvId = null
  } = selectedUserEnv;

  return (
    <details className={className} panelOpen={panelOpen}>
      <summary
        className={summaryClass}
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
              className={`${baseLiClass} ${selectedUserEnvId === d.id &&
                'bg-grey'}`}>
              <div>{d.name}</div>
              <MoreIcon
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
const modalDim = {maxWidth: '40vw'};
function UserPanel({
  className,
  selectedUserId,
  onSelectUser,
  userRegErr,
  // registerUserToEnv,
  users,
  userEnvId,
  PreviewCard,
  inviteUser
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const [modalExt, setModalExt] = useState(false);

  const selectedUser =
    users.find(u => u.uid === selectedUserId) || null;
  const {uid: selUid = null} = selectedUser || {};
  const {username: title = 'All Users'} = selectedUser || {};

  const envUsers = users.filter(u => u.userEnvIds.includes(userEnvId));

  const liClass = u =>
    `${baseLiClass} ${u.uid === selectedUserId && 'bg-grey'}`;

  return (
    <details className={className} panelOpen={panelOpen}>
      <summary
        className={summaryClass}
        onClick={() => setPanelOpen(!panelOpen)}>
        Users - {title}
      </summary>

      <BlackModal visible={modalOpen}>
        <ModalBody
          title="New User"
          style={{...modalDim}}
          onClose={() => setModalOpen(false)}>
          <InviteUserForm
            user={selectedUser || {}}
            onSubmit={inviteUser}
            error={userRegErr}
          />
        </ModalBody>
      </BlackModal>

      {selectedUser ? (
        <UserPreview user={selectedUser} />
      ) : (
        <div>Events</div>
      )}
      <div className="border">
        <div className="flex mt-2 mb-2">
          <div
            className={`${baseLiClass} italic`}
            onClick={() => onSelectUser(null)}>
            All Users
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="ml-1 btn border">
            Invite User
          </button>
        </div>
        <div className="overflow-y-auto">
          <ul style={{height: 200}}>
            {envUsers.map(u => (
              <li
                className={liClass(u)}
                onClick={() => {
                  selUid === u.uid
                    ? setModalExt(!modalExt)
                    : onSelectUser(u.uid);
                }}>
                <span>
                  {u.email} {u.tmp && '(not registered)'}
                </span>
                <MoreIcon />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <BlackModal visible={modalExt}>
        {selectedUser && (
          <ModalBody
            style={{...modalDim}}
            title={`User: ${selectedUser.username}`}
            onClose={() => setModalExt(false)}>
            {selectedUser && <UserDetail user={selectedUser} />}
          </ModalBody>
        )}
      </BlackModal>
    </details>
  );
}

function CardPanel(props) {
  const {
    className,
    cards,
    onCreateCard,
    templateCard,
    selectedUserId,
    urlConfig
  } = props;

  // const [cardId, setCardId] = useState(null);

  const {
    query: {selectedCardId, extended, flipped},
    routing: {routeSelectExtendCard, routeExtendCard}
  } = urlConfig;

  const tmpCards = !selectedUserId ? [...cards, templateCard] : cards;

  const selectedCard =
    tmpCards.find(c => c.id === selectedCardId) || null;

  const [panelOpen, setPanelOpen] = useState(false);

  const h = 10;
  const gridStyle = {
    justifyContent: 'center',
    display: 'grid',
    gridGap: 16,
    // gridAutoFlow: 'column dense',
    gridTemplateColumns: 'repeat(auto-fit, 10rem)',
    gridAutoRows: `minmax(${h}rem, 1fr)`,
    gridTemplateRows: `minmax(${h}rem, 1fr)`
  };

  return (
    <details className={className} panelOpen={panelOpen}>
      <summary
        className={summaryClass}
        onClick={() => setPanelOpen(!panelOpen)}>
        Cards
      </summary>
      <div className="flex flex-wrap" style={{...gridStyle}}>
        {tmpCards.length === 0 && (
          <div className="text-2xl">No Cards</div>
        )}
        {tmpCards.map(c => (
          <PreviewCardSwitch
            edit={c.edit}
            title={c.title.value}
            onClick={() => routeSelectExtendCard(c.id)}
          />
        ))}
      </div>
      <BlackModal visible={extended}>
        {extended && (
          /* TODO */ <MetaCard
            {...selectedCard}
            onCreateCard={onCreateCard}
          />
        )}
      </BlackModal>
    </details>
  );
}
export default function AdminPage(props) {
  const {
    authUser,
    addUserEnv,
    removeUserEnv,
    selectUserEnv,
    urlConfig,
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
    templateCard
  } = props;

  useEffect(() => {
    fetchAllUserEnvs();
    fetchCards();
    getUsers();
  }, []);

  useEffect(
    () => {
      fetchCards();
      // fetchUserIdsFromEnv(userEnvId);
    },
    [userEnvId]
  );

  useEffect(
    () => {
      console.log(
        'selectedUserId',
        selectedUserId,
        'userEnvId',
        userEnvId
      );
      fetchCards();
    },
    [selectedUserId, userEnvId]
  );

  return (
    <div className="content-margin overflow-y-auto">
      <h1 className="mb-3">User Environments</h1>
      <UserEnvPanel className={detailsClass} {...props} />
      <UserPanel
        {...props}
        users={users}
        envUserIds={envUserIds}
        className={detailsClass}
        selectedUserId={selectedUserId}
        registerUserToEnv={registerUserToEnv}
        onSelectUser={selectUser}
      />
      <CardPanel
        {...props}
        title={`Cards ${userEnvId}`}
        className={detailsClass}
        cards={cards}
      />
    </div>
  );
}

AdminPage.defaultProps = {
  envUsers: []
};
