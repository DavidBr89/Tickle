import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import uniq from 'lodash/uniq';

import {SelectTags} from 'Src/components/utils/SelectField';

import {ModalBody} from 'Components/utils/Modal';

import useDeepCompareMemoize from 'Src/components/utils/useDeepCompareMemoize';

import {TOPICS} from 'Src/constants/cardFields';

import PreviewFrame from './PreviewFrame';

export const key = TOPICS;

export const label = 'Topics';

export const ModalContent = props => {
  const {topics: initTags, onChange, modalProps} = props;

  const [topics, setTags] = useState(initTags.value || []);

  useEffect(
    () => {
      onChange({key, label, value: topics});
    },
    [useDeepCompareMemoize(topics)]
  );

  return (
    <ModalBody {...modalProps}>
      <SelectTags
        placeholder="Select Interests"
        optionClassName="text-2xl"
        inputClassName="flex-grow p-2 text-2xl border-2 border-black"
        idAcc={d => d.id}
        onChange={tag => setTags(uniq([...topics, tag]))}
        values={
          /* TODO */
          [{id: 'sports'}, {id: 'yeah'}, {id: 'doooh'}]
        }
      />
      <div className="flex mt-2">
        {topics.length === 0 && (
          <div className="tag-label mb-1 mt-1 bg-grey ">
            No Interests
          </div>
        )}
        {topics.map(d => (
          <div
            className="tag-label mr-1 mt-1 mb-1 bg-black cursor-pointer"
            onClick={() => setTags(topics.filter(e => e !== d))}>
            {d}
          </div>
        ))}
      </div>
    </ModalBody>
  );
};

export const Preview = ({onClick, topics}) => (
  <PreviewFrame
    onClick={onClick}
    type={label}
    empty={topics.value === null || topics.value.length === 0}
    content={() => (
      <div className="flex">
        {topics.value.map(d => (
          <div className="tag-label mr-1">{d}</div>
        ))}
      </div>
    )}
  />
);
