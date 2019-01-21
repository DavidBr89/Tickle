import React, {useState, useEffect} from 'react';
import MoreIcon from 'react-feather/dist/icons/more-horizontal';
import ChevronsLeft from 'react-feather/dist/icons/chevrons-left';
import ChevronsRight from 'react-feather/dist/icons/chevrons-right';
import UserIcon from 'react-feather/dist/icons/user';

import uniq from 'lodash/uniq';
import {SelectTag} from 'Components/utils/SelectField';
import {BlackModal, ModalBody} from 'Components/utils/Modal';
import AlertButton from 'Components/utils/AlertButton';
import {initUserFields} from 'Constants/userFields';

import TabSwitcher from 'Src/components/utils/TabSwitcher';
import useMergeState from 'Src/components/utils/useMergeState';
import useDeepCompareMemoize from 'Src/components/utils/useDeepCompareMemoize';

import styledComp from 'Src/components/utils/styledComp';

const summaryClass = 'mb-3';
const baseLiClass =
  'cursor-pointer p-2 text-lg flex justify-between items-center';

const modalDim = {maxWidth: '40vw'};

const tagClass = 'text-base mr-1 mb-1 p-1 text-white uppercase';

const TagSet = ({values, className, placeholder}) => (
  <div className={`flex mt-1 flex-wrap ${className}`}>
    {values.length === 0 && (
      <div className={`${tagClass} bg-black`}>{placeholder}</div>
    )}
    {values.map(a => (
      <div className={`${tagClass} bg-black`}>{a}</div>
    ))}
  </div>
);

const InviteUser = ({onSubmit, userRegErr}) => {
  const [userProfile, setUserProfile] = useState({...initUserFields});

  const [visibleIndex, setVisibleIndex] = useState(0);

  const BtnHelper = ({
    text,
    className,
    iconLeft,
    iconRight,
    disabled,
    onClick
  }) => (
    <button
      disabled={disabled}
      type="button"
      onClick={onClick}
      className={`w-full btn thick-border ${disabled &&
        'disabled'} w-full ${className}`}>
      <div className="flex justify-center items-center">
        {iconLeft && <div style={{height: 30}}>{iconLeft}</div>}
        <div>{text}</div>
        {iconRight && <div style={{height: 30}}>{iconRight}</div>}
      </div>
    </button>
  );

  const disabled = userProfile === null || !userProfile.email;

  return (
    <TabSwitcher
      visibleIndex={visibleIndex}
      setVisibleIndex={setVisibleIndex}
      tabClassName="p-1">
      <>
        <InviteUserForm
          user={userProfile}
          title="Invite User"
          onChange={prf => setUserProfile(prf)}
        />
        <BtnHelper
          onClick={() => setVisibleIndex(1)}
          disabled={disabled}
          text="Enter learning Profile"
          iconRight={<ChevronsRight className="h-full" />}
        />
      </>
      <>
        <UserProfileUpdate
          user={userProfile}
          onDeficitsChange={newDeficits =>
            setUserProfile({deficits: newDeficits})
          }
          onAimsChange={newAims => setUserProfile({aims: newAims})}
        />
        <div className="mt-auto flex">
          <BtnHelper
            className="mr-2"
            onClick={() => setVisibleIndex(0)}
            disabled={disabled}
            text="Enter Email"
            iconLeft={<ChevronsLeft className="h-full" />}
          />
          <BtnHelper
            onClick={() => setVisibleIndex(2)}
            disabled={disabled}
            text="Send invitation email"
            iconRight={<ChevronsRight className="h-full" />}
          />
        </div>
      </>
      <>
        <SendInvitationEmail
          userProfile={userProfile}
          error={userRegErr}
          onSubmit={msg => onSubmit({...userProfile, msg})}
        />
        <BtnHelper
          onClick={() => setVisibleIndex(1)}
          text="User Profile"
          iconLeft={<ChevronsLeft className="h-full" />}
        />
      </>
    </TabSwitcher>
  );
};

export const UserPreviewInfo = ({user, className, style}) => {
  const {
    username,
    deficits = [],
    aims = [],
    interests,
    fullname,
    email,
    photoURL
  } = user;

  return (
    <div
      className={`${className} border flex flex-wrap p-1`}
      style={style}>
      <UserThumbnail
        user={user}
        className="m-2 flex-none h-1/3 w-1/3"
      />
      <div className="flex flex-col">
        <div className="mt-2 flex flex-col flex-wrap">
          <div className="m-1 flex-auto">
            <label className="tex">Interests</label>
            <TagSet
              className=""
              values={interests}
              placeholder="No Interests"
            />
          </div>
          <div className="flex-auto m-1">
            <label>Learning Aims</label>
            <TagSet
              className=""
              values={aims}
              placeholder="No Interests"
            />
          </div>
          <div className="flex-auto m-1">
            <label>Learning deficits</label>
            <TagSet values={deficits} placeholder="No Interests" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const UserThumbnail = ({user = {}, className, style}) => {
  const {
    username,
    deficits = [],
    aims = [],
    interests,
    fullname,
    email,
    photoURL
  } = user;

  const photoStyle = {
    // maxHeight: 200,
    objectFit: 'contain',
    ...style
  };

  return (
    <div
      style={photoStyle}
      className={`${className} flex flex-col relative`}>
      {photoURL ? (
        <div
          className="flex-grow"
          style={{
            background: `url(${photoURL}) `,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }}
          alt="test"
        />
      ) : (
        <UserIcon className={`flex-grow w-full ${className}`} />
      )}
    </div>
  );
};

const PlaceholderUserPreview = props => (
  <div>PlaceholderUserPreview</div>
);

export const EditUserInfo = ({
  className,
  style,
  onUpdateUser,
  onRemoveUser,
  user,
  ...props
}) => {
  const [userProfile, setProfile] = useMergeState(user);
  useEffect(
    () => {
      onUpdateUser(userProfile);
    },
    [useDeepCompareMemoize(userProfile)]
  );

  return (
    <div className={`flex flex-col ${className} `} style={style}>
      <UserThumbnail
        className="flex-shrink flex-grow mb-2"
        user={user}
        {...props}
      />
      <UserProfileUpdate
        {...props}
        user={userProfile}
        onAimsChange={aims => {
          setProfile({aims});
        }}
        onDeficitsChange={deficits => setProfile({deficits})}
      />
      <AlertButton
        type="button"
        className="btn bg-red btn-shadow text-white flex-no-shrink mt-auto self-end"
        msg="Do you really want to delete the user?"
        onClick={onRemoveUser}>
        Remove User
      </AlertButton>
    </div>
  );
};

const TabBtn = ({className, children, active, ...props}) => (
  <button
    type="button"
    {...props}
    className={`flex-grow btn border ${className} ${
      active ? 'btn-active' : null
    }`}>
    {children}
  </button>
);

// const TabBtn = styledComp({
//   element: 'button',
//   type: 'button',
//   className: 'btn border'
// });

const UserActivity = props => <div>Activity</div>;
const Messenger = props => <div>Messenger</div>;

const UserInfoModal = ({...props}) => {
  const {visible, user, onClose} = props;
  const {username = null} = user || {};

  const [visibleIndex, setVisibleIndex] = useState(0);
  const goToTab = index => () => setVisibleIndex(index);

  const modalContent = user ? (
    <>
      <div className="flex mt-1 mb-3">
        <TabBtn
          active={visibleIndex === 0}
          className="mr-1"
          onClick={goToTab(0)}>
          Activity
        </TabBtn>
        <TabBtn
          active={visibleIndex === 1}
          className="mr-1"
          onClick={goToTab(1)}>
          User Info
        </TabBtn>
        <TabBtn active={visibleIndex === 2} onClick={goToTab(2)}>
          Messenger
        </TabBtn>
      </div>
      <TabSwitcher
        visibleIndex={visibleIndex}
        setVisibleIndex={setVisibleIndex}
        className="flex-grow"
        tabClassName="p-1">
        <UserActivity />
        <EditUserInfo {...props} className="flex-grow" user={user} />
        <Messenger />
      </TabSwitcher>
    </>
  ) : null;

  return (
    <BlackModal visible={visible}>
      <ModalBody title={username} onClose={onClose}>
        {modalContent}
      </ModalBody>
    </BlackModal>
  );
};

const UserProfileUpdate = ({
  onChangeEmail,
  user,
  onAimsChange,
  onDeficitsChange,
  interests = []
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
      <div className="mb-3">
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
      <div className="mb-3">
        <SelectTag
          btnContent="Add"
          placeholder="Enter interests"
          inputClassName="z-0 flex-grow p-2 border-2 border-black"
          className=""
          idAcc={d => d.id}
          onChange={newDeficit =>
            onDeficitsChange(uniq([...deficits, newDeficit]))
          }
          values={[{id: 'sports'}, {id: 'yeah'}, {id: 'doooh'}]}
        />
        <TagSet values={interests} placeholder="No deficits" />
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

const SendInvitationEmail = ({onSubmit, error, ...props}) => {
  const [subject, setSubject] = useState(null);
  const [body, setBody] = useState(null);
  return (
    <form
      className="flex flex-col h-full"
      onSubmit={e => {
        e.preventDefault();
        onSubmit({subject, body});
      }}>
      <section className="mb-2">
        <h2 className="mb-2">Subject:</h2>
        <input
          onChange={e => setSubject(e.target.value)}
          placeholder="Your Subject"
          className="form-control w-full"
        />
      </section>
      <section className="">
        <h2 className="mb-2">Message:</h2>
        <textarea
          onChange={e => setBody(e.target.value)}
          placeholder="Your message"
          className="w-full form-control"
          rows="10"
        />
      </section>
      <button type="submit" className="btn btn-black">
        Send Email
      </button>
      {error && <div className="alert">{error.msg}</div>}
    </form>
  );
};

export const InviteUserForm = ({onChange, error, user}) => {
  const [userProfile, setProfile] = useMergeState(initUserFields);
  const {deficits, aims, mobileNumber, email, name} = userProfile;
  const disabled = email === null;

  useEffect(
    () => {
      onChange(userProfile);
    },
    [useDeepCompareMemoize(userProfile)]
  );

  // onSubmit({...user, aims, deficits, name, email})
  return (
    <form
      className="flex-grow flex flex-col"
      onSubmit={e => e.preventDefault()}>
      <UserThumbnail className="flex-grow" />
      <div className="flex flex-wrap mb-3 p-1">
        <input
          value={email}
          className="form-control flex-grow mr-2"
          onChange={event => setProfile({email: event.target.value})}
          type="email"
          placeholder="email"
        />
        <input
          value={name}
          className="form-control flex-grow "
          onChange={event => setProfile({name: event.target.value})}
          type="text"
          placeholder="First and last name"
        />
        <input
          value={mobileNumber}
          className="form-control flex-grow mt-1"
          onChange={event =>
            setProfile({mobileNumber: event.target.value})
          }
          type="tel"
          placeholder="mobile number"
        />
      </div>
      <div className="mt-auto">
        {error && <div className="alert mb-2">{error.msg}</div>}
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
    selectUser,
    userRegErr,
    updateUser,
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
          <InviteUser onSubmit={inviteUser} userRegErr={userRegErr} />
        </ModalBody>
      </BlackModal>

      {selectedUser ? (
        <UserPreviewInfo
          className=""
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
            onClick={() => selectUser(null)}>
            All Users
          </div>
          <button
            onClick={() => toggleInviteUserModal(true)}
            className="text-base ml-1 btn border">
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
                    : selectUser(u.uid);
                }}>
                <span>
                  {u.email} {u.tmp && '(not registered)'}
                </span>
                <MoreIcon />
              </li>
            ))}
          </ul>
        </div>
        <UserInfoModal
          user={selectedUser}
          visible={userModalOpen}
          onClose={() => toggleUserModal(false)}
          onUpdateUser={updateUser}
          onRemoveUser={() => {
            toggleUserModal(false);
            setTimeout(() => {
              removeUserAcc(selectedUser.uid);
            }, 300);
          }}
        />
      </div>
    </details>
  );
}
