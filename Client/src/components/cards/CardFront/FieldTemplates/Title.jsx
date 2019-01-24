import React, {useState, useEffect} from 'react';

import {ModalBody} from 'Components/utils/Modal';

import {TITLE} from 'Src/constants/cardFields';

import PreviewFrame from './PreviewFrame';

export const id = TITLE;
export const key = TITLE;

export const ModalContent = props => {
  const {modalProps, onChange, visible, title: initTitle} = props;

  const [titleText, setTitleText] = useState(initTitle.value);

  // console.log('titleProps', initTitle, 'titleText', titleText);
  const tmpTitle = {key, value: titleText};

  return (
    <ModalBody
      onClose={() => onChange(tmpTitle)}
      {...modalProps}
      footer={
        <button
          type="button"
          className="btn"
          onClick={() => onChange(tmpTitle)}>
          Update
        </button>
      }>
      <input
        className="capitalize form-control text-2xl w-full text-xl"
        onChange={e => setTitleText(e.target.value || null)}
        value={titleText}
      />
    </ModalBody>
  );
};

export const Preview = ({onClick, title}) => (
  <PreviewFrame
    onClick={onClick}
    className=""
    empty={title.value === null}
    placeholder="Title">
    <div className="capitalize text-2xl truncate-text">
      {title.value}
    </div>
  </PreviewFrame>
);
