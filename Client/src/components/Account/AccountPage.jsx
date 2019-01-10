import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import * as Icon from 'react-feather';

import DB, {addToStorage} from 'Firebase/db';
import uniq from 'lodash/uniq';

// import {BareModal, Modal, ModalBody} from 'Utils/Modal';

import PhotoUpload from 'Utils/PhotoUpload';

import DefaultLayout from 'Components/DefaultLayout';

import {SelectTag} from 'Utils/SelectField';

const USR_IMG_PATH = 'images/usr';
export default function AccountPage(props) {
  const {
    onClose,
    style,
    authUser,
    setAuthUserInfo,
    updateAuthUser
  } = props;

  const {
    uid,
    name: initName,
    email,
    username,
    interests: initInterests,
    photoURL = null
  } = authUser;

  const [interests, setInterests] = useState(initInterests);
  const [name, setName] = useState(initName);
  const [img, setImg] = useState({url: photoURL, file: null});

  useEffect(
    () => {
      if (img.file) {
        addToStorage({
          file: img.file,
          path: `${USR_IMG_PATH}/${uid}`
        }).then(imgUrl => updateAuthUser({photoURL: imgUrl}));
      }
    },
    [img.url, img.file]
  );

  useEffect(
    () => {
      // TODO debounce
      updateAuthUser({name});
    },
    [name]
  );

  useEffect(
    () => {
      updateAuthUser({interests});
    },
    [interests]
  );

  return (
    <DefaultLayout
      className="flex flex-col relative"
      menu={
        <div className="absolute flex justify-center w-full">
          <h1>Account</h1>
        </div>
      }>
      <div className="content-margin flex flex-col overflow-y-auto">
        <section className="mb-2">
          <div className="flex flex-wrap">
            <div className="flex-grow">
              <h2>Name:</h2>
              <input
                className="form-control w-full "
                type="text"
                defaultValue={name}
                placeholder="Full name"
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="ml-2 flex-grow flex flex-col">
              <h2>Email:</h2>
              <div className="border pl-1 text-lg flex-grow flex flex-col justify-center">
                <div>{email}</div>
              </div>
            </div>
          </div>
        </section>
        <section className="flex flex-col mb-2">
          <h2>Photo:</h2>
          <PhotoUpload
            btnClassName="mt-2"
            imgStyle={{height: '30vh'}}
            imgUrl={img.url}
            onChange={newImg => {
              setImg({url: newImg.url, file: newImg.file});
            }}
          />
        </section>
        <section className="text-lg mb-2">
          <h2>Username:</h2>
          <input
            className="form-control w-full"
            type="text"
            defaultValue={username}
          />
        </section>

        <section className="text-lg mb-2">
          <h2>Interests:</h2>
          <SelectTag
            placeholder="Select Interests"
            inputClassName="flex-grow p-2 border-2 border-black"
            className="flex-grow"
            idAcc={d => d.id}
            onChange={tag => setInterests(uniq([...interests, tag]))}
            values={
              /* TODO */
              [{id: 'sports'}, {id: 'yeah'}, {id: 'doooh'}]
            }
          />
          <div className="flex mt-2">
            {interests.length === 0 && (
              <div className="tag-label bg-grey mb-1 mt-1">
                No Interests
              </div>
            )}
            {interests.map(d => (
              <div
                className="tag-label mr-1 mt-1 mb-1 bg-black cursor-pointer"
                onClick={() =>
                  setInterests(interests.filter(e => e !== d))
                }>
                {d}
              </div>
            ))}
          </div>
        </section>
      </div>
    </DefaultLayout>
  );
}

/* {
  <!-- <button -->
    <!--   style={{ width: '100%' }} -->
    <!--   className={css(defaultStylesheet.btn)} -->
    <!--   onClick={() => extendUserInfo()} -->
    <!-- > -->
    <!--   <Icon.Edit /> -->
    <!-- </button> -->
  } */
