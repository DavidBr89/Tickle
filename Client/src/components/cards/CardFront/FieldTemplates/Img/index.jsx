import React, {useState, Component} from 'react';

import {IMG} from 'Src/constants/cardFields';

import {ModalBody} from 'Components/utils/Modal';

import EditImg from 'Src/components/utils/EditImg';
import PreviewFrame from '../PreviewFrame';

export const key = IMG;

export const label = 'Image';

export const ModalContent = props => {
  const {img, onChange, modalProps} = props;

  return (
    <ModalBody {...modalProps}>
      <EditImg
        className="flex-grow"
        {...img.value}
        onChange={imgVal => {
          console.log('imgVal', imgVal);
            onChange({key, label, value: imgVal})}
        }

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
