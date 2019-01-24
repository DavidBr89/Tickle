import React, {Component, useState} from 'react';

import {Modal, ModalBody} from 'Components/utils/Modal';
import {DESCRIPTION} from 'Src/constants/cardFields';

import PreviewFrame from './PreviewFrame';

export const key = DESCRIPTION;
export const label = 'description';

export const ModalContent = props => {
  const {onChange, modalProps, description} = props;
  const [text, setText] = useState(description.value);
  const tmpData = {key, label, value: text};

  return (
    <ModalBody
      {...modalProps}
      footer={
        <button
          type="button"
          className="btn"
          onClick={() => onChange(tmpData)}>
          Update
        </button>
      }>
      <textarea
        className="form-control w-full"
        onChange={e => setText(e.target.value)}
        rows={5}
        placeholder="Please insert your description">
        {text}
      </textarea>
    </ModalBody>
  );
};

export const Preview = ({description, onClick}) => (
  <PreviewFrame
    onClick={onClick}
    empty={description.value === null}
    placeholder="Description">
    <div className="capitalize truncate-text text-xl">
      {description.value}
    </div>
  </PreviewFrame>
);
