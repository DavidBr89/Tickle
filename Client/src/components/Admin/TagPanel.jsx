import React, {useState, useEffect, useLayoutEffect} from 'react';
import MoreIcon from 'react-feather/dist/icons/more-horizontal';

import UserIcon from 'react-feather/dist/icons/user';
import uniq from 'lodash/uniq';
import {SelectTag} from 'Components/utils/SelectField';
import {BlackModal, ModalBody} from 'Components/utils/Modal';
import AlertButton from 'Components/utils/AlertButton';
import isEqual from 'lodash/isEqual';

export default function TagPanel(props) {
  const {
    className,
    selectedUserId,
    onSelectUser,
    userRegErr,
    title="",
    // registerUserToEnv,
    users,
    userEnvId,
    PreviewCard,
  } = props;

  const [inviteUserModalOpen, toggleInviteUserModal] = useState(false);
  // TODO untangle
  const [panelOpen, setPanelOpen] = useState(false);

  // const [userModalOpen, toggleUserModal] = useState(false);

  // const selectedUser =
  //   users.find(u => u.uid === selectedUserId) || null;
  //
  // const {uid: selUid = null} = selectedUser || {};
  // const {username: title = 'All Users'} = selectedUser || {};
  //
  // const envUsers = users.filter(u => u.userEnvIds.includes(userEnvId));
  // console.log('all users', users);
  // console.log('selected user', users);

  const headerHeight = 300;

  return (
    <details className={className} panelOpen={panelOpen}>
      <summary
        className="mb-3"
        onClick={() => setPanelOpen(!panelOpen)}>
        TagPanel - {title}
      </summary>
    </details>
  );
}
