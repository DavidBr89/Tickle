import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {ModalBody} from 'Src/components/utils/Modal';

import {ACTIVITY} from 'Src/constants/cardFields';

import TextChallengeAuthor from './TextChallengeAuthor';

import PreviewFrame from '../PreviewFrame';

export const key = ACTIVITY;
export const label = 'activity';

const ActivityAuthor = props => {
  const {activity: initAcitivity, modalProps, onChange} = props;

  const [activity, setActivity] = useState({
    id: null,
    img: {url: null},
    ...initAcitivity.value
  });

  const btnDisabled = activity.description === null;

  return (
    <ModalBody
      {...modalProps}
      footer={
        <button
          type="button"
          className="btn border"
          disabled={btnDisabled}
          style={{lineHeight: 0}}
          onClick={() => {
            onChange({key, label, ...activity});
          }}>
          <div className="m-3">
            <strong>{activity.id === null ? 'Add' : 'Update'}</strong>
          </div>
        </button>
      }>
      <TextChallengeAuthor {...activity} onChange={setActivity} />
    </ModalBody>
  );
};

export const ModalContent = ActivityAuthor;

export const Preview = ({activity, onClick}) => (
  <PreviewFrame
    onClick={onClick}
    empty={activity.value === null}
    placeholder="Activity">
    <div className="capitalize truncate-text text-xl">
      {activity.value}
    </div>
  </PreviewFrame>
);
