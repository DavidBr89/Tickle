import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import uuidv1 from 'uuid/v1';
// import uniq from 'lodash/uniq';
// import UserIcon from 'react-feather/dist/icons/user';

import {SelectInput} from 'Components/utils/SelectField';
import {Link, withRouter} from 'react-router-dom';
import {TEMP_ID} from 'Constants/cardFields';

import {initCard} from 'Constants/cardFields';

import {SelectTag} from 'Components/utils/SelectField';

import DefaultLayout from 'Components/DefaultLayout';
import UserPanel from './UserPanel';
import TopicPanel from './TopicPanel';
import UserEnvPanel from './UserEnvPanel.jsx';
import CardPanel from './CardPanel';

const detailsClass = 'shadow text-2xl p-2 mb-5 border-2 border-black';
const summaryClass = 'mb-3';

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
    fetchUsers,
    selectUser,
    selectedUsers,
    selectedUserId,
    collectibleCards,
    fetchCards,
    envUserIds,
    fetchUserIdsFromEnv,
    registerUserToEnv,
    cards,
    templateCard,
    fetchTopics
  } = props;

  useEffect(() => {
    fetchAllUserEnvs();
    fetchCards();
    fetchUsers();
  }, []);

  useEffect(
    () => {
      fetchCards();
      fetchTopics(userEnvId);
      // fetchUserIdsFromEnv(userEnvId);
    },
    [userEnvId]
  );

  useEffect(
    () => {
      fetchCards();
    },
    [selectedUserId, userEnvId]
  );

  return (
    <DefaultLayout
      className="flex flex-col relative "
      menu={
        <div className="absolute flex justify-center w-full">
          <h1>Admin</h1>
        </div>
      }>
      <div className="content-margin overflow-y-auto">
        <UserEnvPanel className={detailsClass} {...props} />
        <TopicPanel {...props} className={detailsClass} />
        <UserPanel {...props} className={detailsClass} />
        <CardPanel
          {...props}
          title={`Cards ${userEnvId}`}
          className={detailsClass}
        />
      </div>
    </DefaultLayout>
  );
}

AdminPage.defaultProps = {
  envUsers: []
};
