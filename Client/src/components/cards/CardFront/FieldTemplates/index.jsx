import React, {useState, useEffect, Component} from 'react';

import PropTypes from 'prop-types';

import {Modal, ModalBody} from 'Components/utils/Modal';

import {
  TITLE,
  TAGS,
  DESCRIPTION,
  MEDIA,
  TIMERANGE,
  ACTIVITY,
  POINTS,
  IMG
} from 'Constants/cardFields';

import * as Img from './Img';
import MediaSearch from './MediaSearch';

import * as Title from './Title';
import * as Description from './Description';
import * as Activity from './Activity';
import * as Tags from './Tags';
import * as Videos from './Videos';

export function NumberInput({...props}) {
  const {onUpdate, data, onClose} = props;
  const [numPoints, setNumPoints] = useState(data.value);
  const [error, setError] = useState(null);

  const isPosInt = val => /^\+?(0|[1-9]\d*)$/.test(val);

  useEffect(() => {
    // if (numPoints !== prevState.numPoints) {
    //   if (this.isPosInt()) {
    //     this.setState({error: null});
    //   } else {
    //     this.setState({error: 'Input is not a positive Integer'});
    //   }
    // }
  });

  const disabled = error !== null;

  return (
    <ModalBody
      {...props}
      onClose={() => onClose()}
      footer={
        <button
          type="button"
          className="btn thick-border"
          style={{
            opacity: disabled ? 0.5 : 1,
            transition: 'opacity 200ms'
          }}
          disabled={disabled}
          onClick={() => onUpdate({value: numPoints})}>
          Update
        </button>
      }>
      <input
        type="number"
        numPoints={numPoints}
        pattern="^[0-9]"
        min="0"
        step="1"
        onChange={e => {
          setNumPoints(e.target.value);
        }}
      />
      <div>{error}</div>
    </ModalBody>
  );
}

const TimeRange = () => <div>test</div>;

export const fieldComps = {
  // TODO: gif wikipedia
  [Title.key]: Title,
  [Description.key]: Description,
  [Img.key]: Img,
  [Videos.key]: Videos,
  [Tags.key]: Tags,
  [Activity.key]: Activity
};
