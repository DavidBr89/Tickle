import React, {Component, useState} from 'react';

import {Modal, ModalBody} from 'Components/utils/Modal';
import {DESCRIPTION} from 'Src/constants/cardFields';

import PreviewFrame from './PreviewFrame';

export const key = DESCRIPTION;
export const label = 'Description';

export const ModalContent = props => {
  const {onChange, modalProps, description} = props;

  return (
    <ModalBody {...modalProps}>
      <textarea
        className="mt-1 form-control w-full text-lg"
        onChange={e => onChange({key, label, value: e.target.value})}
        rows={8}
        placeholder="Please insert your description">
        {description.value}
      </textarea>
    </ModalBody>
  );
};

export const Preview = ({description, onClick}) => (
  <PreviewFrame
    onClick={onClick}
    empty={description.value === null}
    content={() => description.value}
    type={label}
  />
);
