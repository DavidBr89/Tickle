import React, {useState} from 'react';

import UserIcon from 'react-feather/dist/icons/user';
import uniq from 'lodash/uniq';
import {SelectTag} from 'Components/utils/SelectField';

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
    <img alt-text="user photo" src={photoURL} style={photoStyle} />
  ) : (
    <UserIcon style={photoStyle} />
  );
  console.log('user', user);

  return (
    <div className={`${className} flex`} style={style}>
      <div style={{flex: '0.5'}}>{photo}</div>

      <div className="ml-3 flex-grow">
        <div>{fullname}</div>
        <div className="text-sm">{email}</div>
        <div className="mt-2 flex justify-between">
          <div className="">
            <label>Interests</label>
            <TagSet values={interests} placeholder="No Interests" />
          </div>
          <div className="">
            <label>Deficits</label>
            <TagSet values={deficits} placeholder="No Deficits" />
          </div>
        </div>
      </div>
    </div>
  );
};

const PlaceholderUserPreview = props => (
  <div>PlaceholderUserPreview</div>
);

export const UserDetail = ({className, style, ...props}) => (
  <div className={`${className} border p-2`} style={style}>
    <UserPreview {...props} className="" />
    <UserProfileUpdate {...props} />
  </div>
);

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

export const InviteUserForm = ({onSubmit, error, user}) => {
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
          className="form-control flex-grow"
          onChange={event => setFullName(event.target.value)}
          type="text"
          placeholder="First and last name"
        />
      </div>
      <UserProfileUpdate
        user={{...user, deficits, aims}}
        onDeficitsChange={setDeficits}
        onAimsChange={setAims}
      />
      <div className="mt-auto">
        {error && <div className="alert mb-2">{error.msg}</div>}
        <button
          disabled={disabled}
          type="submit"
          className={`w-full mt-3 btn btn-black ${disabled &&
            'disabled'}`}
          onClick={() =>
            onSubmit({...user, aims, deficits, fullName, email})
          }>
          Create{' '}
        </button>
      </div>
    </form>
  );
};
