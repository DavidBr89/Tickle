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

import PhotoUpload from 'Src/components/utils/PhotoUpload';
import EditImg from 'Src/components/utils/EditImg';
import TabSwitcher from 'Src/components/utils/TabSwitcher';

function useDidUpdateEffect(fn, inputs) {
  const didMountRef = React.useRef(false);

  useEffect(() => {
    if (didMountRef.current) fn();
    else didMountRef.current = true;
  }, inputs);
}

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

const TopicForm = ({...props}) => {
  const {setTopic, submitBtn, topic} = props;
  const [tabIndex, setTabIndex] = useState(0);

  const btnClassName = i =>
    `flex-grow btn text-lg ${tabIndex === i && 'btn-active'}`;

  return (
    <div className="flex-grow flex flex-col">
      <div className="flex mt-2">
        <button
          className={btnClassName(0)}
          type="button"
          onClick={() => setTabIndex(0)}>
          Info
        </button>
        <button
          type="button"
          className={btnClassName(1)}
          onClick={() => setTabIndex(1)}>
          Image
        </button>
      </div>
      <TabSwitcher
        visibleIndex={tabIndex}
        className="flex-grow flex flex-col"
        tabClassName="mt-3">
        <div className="flex flex-col flex-grow">
          <div className="w-full">
            <h3>Title:</h3>
            <input
              className="w-full form-control"
              onChange={e => setTopic({title: e.target.value})}
              type="text"
              value={topic.title || ''}
            />
          </div>
          <div className="mt-3 w-full">
            <h3>Description:</h3>
            <textarea
              onChange={e => setTopic({description: e.target.value})}
              rows="10"
              className="w-full form-control"
              type="text"
              value={topic.description || ''}
            />
          </div>
          {submitBtn}
        </div>
        <EditImg
          {...topic.img}
          className="flex-grow"
          onChange={img => setTopic({img})}
        />
      </TabSwitcher>
    </div>
  );
};

const NewTopic = ({...props}) => {
  const {onSubmit} = props;

  const [topic, setTopic] = useMergeState({
    description: null,
    title: null,
    id: uuidv1()
  });

  const disabled = topic.description === null && topic.title === null;
  console.log('topic', topic);

  return (
    <TopicForm
      className="flex-grow flex flex-col"
      topic={topic}
      setTopic={setTopic}
      submitBtn={
        <button
          type="button"
          className="btn text-lg border mt-auto"
          disabled={disabled}
          onClick={() => {
            onSubmit(topic);
            setTopic({
              title: null,
              description: null,
              id: uuidv1(),
              img: null
            });
          }}>
          Add Topic
        </button>
      }
    />
  );
};

const UpdateTopic = ({...props}) => {
  const {onSubmit, onRemove, onChange, topic: initTopic} = props;

  const [topic, setTopic] = useMergeState({
    description: null,
    title: null,
    id: uuidv1(),
    ...initTopic
  });

  useDidUpdateEffect(
    () => {
      onChange(topic);
    },
    [useDeepCompareMemoize(topic)]
  );

  const disabled = topic.description === null && topic.title === null;

  return (
    <TopicForm
      className="flex-grow flex flex-col"
      topic={topic}
      setTopic={setTopic}
      submitBtn={
        <button
          type="button"
          className="btn text-lg border mt-auto bg-red"
          onClick={() => {
            onRemove(topic);
          }}>
          Remove
        </button>
      }
    />
  );
};

export default function TopicPanel(props) {
  const {
    className,
    selectedUserId,
    onSelectUser,
    userRegErr,
    title = '',
    updateTopic,
    users,
    topicDict,
    removeTopic,
    userEnvId
  } = props;

  console.log('topicDict', topicDict);
  const onSubmitTopic = topic => updateTopic(topic, userEnvId);
  const onRemoveTopic = topicId => removeTopic(topicId, userEnvId);

  const [modal, setModal] = useState(false);
  const [topicId, setTopicId] = useState(null);
  const topic = topicDict.find(t => t.id === topicId) || null;

  const selectTopic = id => {
    setTopicId(id);
    setModal(true);
  };

  // TODO untangle
  const [panelOpen, setPanelOpen] = useState(false);

  const headerHeight = 300;

  const detailsClass = 'shadow text-2xl p-2 mb-5 border-2 border-black';

  const newTopicInstance = (
    <NewTopic
      topic={topic}
      onSubmit={t => {
        onSubmitTopic(t);
        setModal(false);
      }}
    />
  );

  const updateTopicInstance = (
    <UpdateTopic
      topic={topic}
      key={topic ? topic.id : 'new topic'}
      onChange={onSubmitTopic}
      onRemove={t => {
        onRemoveTopic(t.id);
        setModal(false);
      }}
    />
  );

  return (
    <details
      className={`${className} ${detailsClass}`}
      panelOpen={panelOpen}>
      <BlackModal visible={modal}>
        <ModalBody title="Edit Topic" onClose={() => setModal(false)}>
          {topicId === null ? newTopicInstance : updateTopicInstance}
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
            onClick={() => {
              selectTopic(a.id);
            }}>
            {a.title}
          </div>
        ))}
        {topicDict.length === 0 && <div className="">No topics</div>}
        <button
          type="button"
          className="tag-label w-32 h-32 thick-border mr-1 mb-1 text-black"
          onClick={() => selectTopic(null)}>
          Add new Topic
        </button>
      </div>
    </details>
  );
}
