import React, {useState, Component} from 'react';

import {IMG} from 'Src/constants/cardFields';

import {ModalBody} from 'Components/utils/Modal';

import PreviewFrame from '../PreviewFrame';

import EditImg from './EditImg';

export const key = IMG;

export const label = IMG;

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

export const Preview = ({onClick, img}) => {
  const imgText = () => {
    if (img.value) {
      return img.value.name || img.value.url;
    }
    return 'No Image';
  };

  return (
    <PreviewFrame
      onClick={onClick}
      className=""
      empty={img.value === null}
      placeholder="Tags">
      <div className="text-2xl truncate-text flex">{imgText()}</div>
    </PreviewFrame>
  );
};
