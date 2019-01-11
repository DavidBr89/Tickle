import React, {useState, useEffect} from 'react';
import MoreIcon from 'react-feather/dist/icons/more-horizontal';

import UserIcon from 'react-feather/dist/icons/user';
import uniq from 'lodash/uniq';
import {SelectTag} from 'Components/utils/SelectField';
import {BlackModal, ModalBody} from 'Components/utils/Modal';
import AlertButton from 'Components/utils/AlertButton';
import isEqual from 'lodash/isEqual';

import TabSwitcher from 'Src/components/utils/Fade';

function useDeepCompareMemoize(value) {
  const getMemoized = React.useMemo(() => {
    let memoized;
    return current => {
      if (!isEqual(current, memoized)) {
        memoized = current;
      }
      return memoized;
    };
  }, []);
  return getMemoized(value);
}

const summaryClass = 'mb-3';
const baseLiClass =
  'cursor-pointer p-2 text-lg flex justify-between items-center';

const modalDim = {maxWidth: '40vw'};

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

const useMergeState = initState => {
  const [state, setState] = useState(initState);
  const mergeState = newState => setState({...state, ...newState});
  return [state, mergeState];
};

export const UserPreview = ({user, className, style}) => {
  const {
    username,
    deficits = [],
    interests,
    fullname,
    email,
    photoURL
  } = user;

  const photoStyle = {minWidth: 300, height: 200};
  const photo = photoURL ? (
    <img
      className="flex-grow"
      alt-text="user photo"
      src={photoURL}
      style={photoStyle}
    />
  ) : (
    <UserIcon className="flex-grow" style={photoStyle} />
  );

  return (
    <div
      className={`${className} border flex flex-wrap p-2`}
      style={style}>
      <div className="flex flex-col" style={{flex: '0.5'}}>
        {photo}
      </div>
      <div className="ml-3 flex flex-col ">
        <div>{fullname}</div>
        <div className="text-sm">{email}</div>
        <div className="mt-2 flex ">
          <div className="">
            <label>Interests</label>
            <TagSet values={interests} placeholder="No Interests" />
          </div>
        </div>
      </div>
    </div>
  );
};

const PlaceholderUserPreview = props => (
  <div>PlaceholderUserPreview</div>
);

export const UserDetail = ({
  className,
  style,
  updateUser,
  onRemoveUser,
  user,
  ...props
}) => {
  const [userProfile, setProfile] = useMergeState(user);
  useEffect(
    () => {
      updateUser(userProfile);
    },
    [useDeepCompareMemoize(userProfile)]
  );

  return (
    <div className={`${className} p-2 flex flex-col`} style={style}>
      <UserPreview user={user} {...props} className="mb-2 p-2" />
      <UserProfileUpdate
        {...props}
        user={userProfile}
        onAimsChange={aims => {
          console.log('aims change', aims);

          setProfile({aims});
        }}
        onDeficitsChange={deficits => setProfile({deficits})}
      />
      <AlertButton
        type="button"
        className="btn bg-red btn-shadow text-white self-end mt-auto"
        msg="Do you really want to delete the user?"
        onClick={onRemoveUser}>
        Remove User
      </AlertButton>
    </div>
  );
};

const UserProfileUpdate = ({
  onChangeEmail,
  user,
  onAimsChange,
  onDeficitsChange
}) => {
  const {aims = [], deficits = [], goals = []} = user;
  return (
    <>
      <div className="mb-3">
        <SelectTag
          placeholder="Enter Learning Aims"
          inputClassName="flex-grow p-2 border-2 border-black"
          idAcc={d => d.id}
          onChange={newAim => {
            onAimsChange(uniq([...aims, newAim]));
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
          onChange={newDeficit =>
            onDeficitsChange(uniq([...deficits, newDeficit]))
          }
          values={[{id: 'sports'}, {id: 'yeah'}, {id: 'doooh'}]}
        />
        <TagSet values={deficits} placeholder="No deficits" />
      </div>
    </>
  );
};

// const TabSwitcher = ({children}) => {
//   const [visibleIndex, setVisibleIndex] = useState(0);
//
//   return (
//     <div className="flex relative flex-col flex-grow overflow-hidden">
//       {children.map((t, i) => (
//         <Fade
//           className="absolute w-full h-full flex flex-col flex-grow"
//           in={visibleIndex === i}>
//           {t}
//           <div className="w-full flex justify-between">
//             <button
//               onClick={() =>
//                 setVisibleIndex(Math.max(0, visibleIndex - 1))
//               }>
//               back
//             </button>
//             <button
//               onClick={() =>
//                 setVisibleIndex(
//                   Math.min(children.length, visibleIndex + 1)
//                 )
//               }>
//               forward
//             </button>
//           </div>
//         </Fade>
//       ))}
//     </div>
//   );
// };

const SendInvitationEmail = ({onSubmit, ...props}) => {
  const [subject, setSubject] = useState(null);
  const [msg, setMsg] = useState(null);
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}>
      <input className="form-control" />
      <textArea />
    </form>
  );
};

export const InviteUserForm = ({onSubmit, error, user}) => {
  const [userProfile, setProfile] = useMergeState({
    deficits: [],
    aims: [],
    email: null,
    name: null
  });
  const {deficits, aims, email, name} = userProfile;
  const disabled = email === null;

  const [modalOpen, setModalOpen] = useState(false);

  // onSubmit({...user, aims, deficits, name, email})
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
          onChange={event => setProfile({email: event.target.value})}
          type="email"
          placeholder="email"
        />
        <input
          value={name}
          className="form-control flex-grow"
          onChange={event => setProfile({name: event.target.value})}
          type="text"
          placeholder="First and last name"
        />
      </div>
      <UserProfileUpdate
        user={userProfile}
        onDeficitsChange={newDeficits =>
          setProfile({deficits: newDeficits})
        }
        onAimsChange={newAims => setProfile({aims: newAims})}
      />
      <div className="mt-auto">
        {error && <div className="alert mb-2">{error.msg}</div>}
        <button
          disabled={disabled}
          type="submit"
          className={`w-full mt-3 btn btn-black ${disabled &&
            'disabled'}`}
          onClick={() => onSubmit(userProfile)}>
          Send Email Invitation
        </button>
      </div>
    </form>
  );
};

const UserEvents = ({...props}) => {
  const {events, className, style} = props;
  return (
    <div className={className} style={style}>
      <ul>
        {events.map(e => (
          <li>{e.id}</li>
        ))}
      </ul>
    </div>
  );
};

UserEvents.defaultProps = {events: [], style: {}};

export default function UserPanel(props) {
  const {
    className,
    selectedUserId,
    onSelectUser,
    userRegErr,
    // registerUserToEnv,
    users,
    userEnvId,
    PreviewCard,
    inviteUser,
    removeUserAcc
  } = props;

  const [inviteUserModalOpen, toggleInviteUserModal] = useState(false);
  // TODO untangle
  const [panelOpen, setPanelOpen] = useState(false);

  const [userModalOpen, toggleUserModal] = useState(false);

  const selectedUser =
    users.find(u => u.uid === selectedUserId) || null;

  const {uid: selUid = null} = selectedUser || {};
  const {username: title = 'All Users'} = selectedUser || {};

  const envUsers = users.filter(u => u.userEnvIds.includes(userEnvId));
  console.log('all users', users);
  console.log('selected user', users);

  const liClass = u =>
    `${baseLiClass} ${u.uid === selectedUserId && 'bg-grey'}`;

  const headerHeight = 300;
  return (
    <details className={className} panelOpen={panelOpen}>
      <summary
        className={summaryClass}
        onClick={() => setPanelOpen(!panelOpen)}>
        Users - {title}
      </summary>

      <BlackModal visible={inviteUserModalOpen}>
        <ModalBody
          title="New User"
          style={{...modalDim}}
          onClose={() => toggleInviteUserModal(false)}>
          <TabSwitcher>
            <InviteUserForm
              title="Invite User"
              user={selectedUser || {}}
              onSubmit={inviteUser}
              error={userRegErr}
            />
            <SendInvitationEmail title="Send Invitation Email" />
          </TabSwitcher>
        </ModalBody>
      </BlackModal>

      {selectedUser ? (
        <UserPreview
          user={selectedUser}
          style={{height: headerHeight}}
        />
      ) : (
        <UserEvents style={{height: headerHeight}} />
      )}
      <div className="border">
        <div className="flex mt-2 mb-2">
          <div
            className={`${baseLiClass} italic`}
            onClick={() => onSelectUser(null)}>
            All Users
          </div>
          <button
            onClick={() => toggleInviteUserModal(true)}
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
                    ? toggleUserModal(!userModalOpen)
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

      <BlackModal visible={userModalOpen}>
        {selectedUser && (
          <ModalBody
            style={{...modalDim}}
            title={`User: ${selectedUser.username}`}
            onClose={() => toggleUserModal(false)}>
            {selectedUser && (
              <UserDetail
                {...props}
                className="flex-grow"
                user={selectedUser}
                onRemoveUser={() => {
                  toggleUserModal(false);
                  setTimeout(() => {
                    removeUserAcc(selectedUser.uid);
                  }, 300);
                }}
              />
            )}
          </ModalBody>
        )}
      </BlackModal>
    </details>
  );
}
