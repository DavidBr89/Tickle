import React, {useState, useEffect} from 'react';

import {ModalBody} from 'Components/utils/Modal';

import {LOC} from 'Src/constants/cardFields';

import PreviewFrame from '../PreviewFrame';
import GeoLocation from './GeoLocation';

export const label = 'GeoLocation';
export const key = LOC;

export const ModalContent = props => {
  const {modalProps, onChange, visible, title: initTitle} = props;

  return (
    <ModalBody {...modalProps}>
      <GeoLocation
        {...props}
        onChange={loc => onChange({key, label, value: loc})}
      />
    </ModalBody>
  );
};

export const Preview = ({onClick, loc}) => {
  console.log('loc', loc);
  return (
    <PreviewFrame
      onClick={onClick}
      type={label}
      empty={loc.value === null}
      content={() => (
        <div className="text-truncate">
          {loc.value && loc.value.longitude}
          {loc.value && loc.value.latitude}
        </div>
      )}
    />
  );
};
