import React, {useState, Component} from 'react';

import {IMG} from 'Src/constants/cardFields';

import {ModalBody} from 'Components/utils/Modal';

import PreviewFrame from '../PreviewFrame';

import EditImg from './EditImg';

export const key = IMG;

export const label = 'Image';

export const ModalContent = props => {
  const {img, onChange, modalProps} = props;

  return (
    <ModalBody {...modalProps}>
      <EditImg
        className="flex-grow"
        imgUrl={img.value ? img.value.url : null}
        imgName={img.value && img.value.name}
        onChange={imgVal => onChange({key, label, value: imgVal})}
      />
    </ModalBody>
  );
};

export const Preview = ({onClick, img}) => (
  <PreviewFrame
    onClick={onClick}
    type={label}
    empty={img.value === null}
    content={() => (
      <div className="truncate-text">
        {img.value.name || img.value.url}
      </div>
    )}
  />
);
