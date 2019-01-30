import React, {useState, useEffect, useLayoutEffect} from 'react';
import MoreIcon from 'react-feather/dist/icons/more-horizontal';

import UserIcon from 'react-feather/dist/icons/user';
import uniq from 'lodash/uniq';
import {SelectTag} from 'Components/utils/SelectField';
import {BlackModal, ModalBody} from 'Components/utils/Modal';
import AlertButton from 'Components/utils/AlertButton';
import isEqual from 'lodash/isEqual';

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
export default function CardTemplatePanel(props) {
  const {
    className,
    selectedUserId,
    onSelectUser,
    userRegErr,
    title = '',
    createTopic,
    // registerUserToEnv,
    users,
    topicDict
  } = props;

  const [isModalOpen, setModalOpen] = useState(false);
  const [topicId, setTopicId] = useState(null);
  // const topic = topicDict.find(t => t.id === topicId);

  // TODO untangle
  const [panelOpen, setPanelOpen] = useState(false);

  const headerHeight = 300;

  const detailsClass = 'shadow text-2xl p-2 mb-5 border-2 border-black';

  return (
    <details
      className={`${className} ${detailsClass}`}
      panelOpen={panelOpen}>
      <summary
        className="mb-3"
        onClick={() => setPanelOpen(!panelOpen)}>
        Card Template - {title}{' '}
      </summary>
      <div className="flex mt-1 flex-wrap">test</div>
    </details>
  );
}
