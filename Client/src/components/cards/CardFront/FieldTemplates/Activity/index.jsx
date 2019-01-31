import React, {useState} from 'react';
import PropTypes from 'prop-types';


import {ModalBody} from '~/components/utils/Modal';
import {ACTIVITY} from '~/constants/cardFields';
import TextChallengeAuthor from './TextChallengeAuthor';
import PreviewFrame from '../PreviewFrame';

export const key = ACTIVITY;
export const label = 'Activity';

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
      <TextChallengeAuthor
        {...activity}
        onChange={value => setActivity({key, label, value})}
      />
    </ModalBody>
  );
};

export const ModalContent = ActivityAuthor;

export const Preview = ({activity, onClick}) => (
  <PreviewFrame
    onClick={onClick}
    type={label}
    empty={activity.value === null}
    content={() => activity.value.title}
  />
);
