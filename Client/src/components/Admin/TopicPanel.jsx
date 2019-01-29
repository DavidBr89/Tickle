import React, {useState, useEffect, useLayoutEffect} from 'react';
import MoreIcon from 'react-feather/dist/icons/more-horizontal';

import UserIcon from 'react-feather/dist/icons/user';
import uniq from 'lodash/uniq';
import {SelectTag} from 'Components/utils/SelectField';
import {BlackModal, ModalBody} from 'Components/utils/Modal';
import AlertButton from 'Components/utils/AlertButton';
import isEqual from 'lodash/isEqual';

import uuidv1 from 'uuid/v1';

import useMergeState from 'Src/components/utils/useMergeState';
import useDeepCompareMemoize from 'Src/components/utils/useDeepCompareMemoize';

// const TagSet = ({values, className, placeholder}) => (
//   <div className={`flex mt-1 flex-wrap ${className}`}>
//     {values.length === 0 && (
//       <div className="tag-label bg-grey mr-1 mb-1">{placeholder}</div>
//     )}
//     {values.map(a => (
//       <div className="tag-label bg-black mr-1 mb-1">{a}</div>
//     ))}
//   </div>
// );

const NewTopic = ({...props}) => {
  const {onSubmit, onRemove, topic: initTopic} = props;

  const defaultTopic = {description: null, title: null, id: uuidv1()};
  const [topic, setTopic] = useMergeState(initTopic || defaultTopic);

  const disabled = topic.description === null && topic.title === null;

  console.log('topic', topic);
  // useEffect(
  //   () => {
  //     if (topic.description && topic.title) {
  //       onSubmit(topic);
  //     }
  //   },
  //   [useDeepCompareMemoize(topic)]
  // );

  return (
    <div>
      <div className="w-full">
        <div>Title:</div>
        <input
          className="w-full form-control"
          onChange={e => setTopic({title: e.target.value})}
          type="text"
          value={topic.title}
        />
      </div>
      <div className="w-full">
        <div>Description:</div>
        <textarea
          onChange={e => setTopic({description: e.target.value})}
          rows="10"
          className="w-full form-control"
          type="text"
          value={topic.description}
        />
      </div>
      <button
        type="button"
        className="btn"
        disabled={disabled}
        onClick={() => {
          onSubmit(topic);
          setTopic({...defaultTopic});
        }}>
        {initTopic ? 'Update Topic' : 'Add new Topic'}
      </button>
    </div>
  );
};
export default function TopicPanel(props) {
  const {
    className,
    selectedUserId,
    onSelectUser,
    userRegErr,
    title = '',
    onSubmitTopic,
    users,
    topicDict,
    removeTopic
  } = props;

  const [isModalOpen, setModalOpen] = useState(false);
  const [topicId, setTopicId] = useState(null);
  const topic = topicDict.find(t => t.id === topicId) || null;

  // TODO untangle
  const [panelOpen, setPanelOpen] = useState(false);

  const headerHeight = 300;

  const detailsClass = 'shadow text-2xl p-2 mb-5 border-2 border-black';

  return (
    <details
      className={`${className} ${detailsClass}`}
      panelOpen={panelOpen}>
      <BlackModal visible={isModalOpen}>
        <ModalBody
          title="Edit Topic"
          onClose={() => setModalOpen(false)}>
          <NewTopic
            topic={topic}
            onSubmit={onSubmitTopic}
            onRemove={removeTopic}
          />
        </ModalBody>
      </BlackModal>
      <summary
        className="mb-3"
        onClick={() => setPanelOpen(!panelOpen)}>
        Topic Panel - {title}{' '}
      </summary>
      <div className="flex mt-1 flex-wrap">
        {topicDict.map(a => (
          <div
            className="tag-label w-32 h-32 bg-black mr-1 mb-1"
            onClick={() => setTopicId(a.id)}>
            {a.title}
          </div>
        ))}
        {topicDict.length === 0 && (
          <div className="tag-label text-white w-32 h-32 bg-grey mr-1 mb-1 text-2xl">
            No topics
          </div>
        )}
        <button
          type="button"
          className="tag-label w-32 h-32 thick-border mr-1 mb-1 text-black"
          onClick={() => setModalOpen(true)}>
          Add new Topic
        </button>
      </div>
    </details>
  );
}
