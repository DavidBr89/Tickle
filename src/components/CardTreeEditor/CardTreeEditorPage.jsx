import React, {memo, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Plus from 'react-feather/dist/icons/plus';
import Minus from 'react-feather/dist/icons/minus';

import uuidv1 from 'uuid/v1';

import TreeView from 'Components/utils/TreeView';
import PreviewCardStack from 'Components/cards/PreviewCardStack';

import DefaultLayout from 'Components/DefaultLayout';

import {EditOneTag} from 'Utils/TagInput';

const isLeafNode = d => d.children.length === 0 && d.depth !== 0;

const TreeNode = ({btnSize = 17, ...props}) => {
  const {
    id,
    title,
    onAdd,
    onRemove,
    onTitleChange,
    children,
    tagVocabulary,
  } = props;

  const isLeaf = isLeafNode(props);
  console.log('data', props.depth, isLeaf);
  return (
    <div className="p-1 w-64">
      <EditOneTag
        className="form-control text-2xl font-bold"
        defaultValue={title}
        vocabulary={tagVocabulary}
        onChange={t => onTitleChange({...props, tite: t.tagId})}
      />

      <div className="flex justify-center">
        <div className="flex flex-col justify-center items-center">
          <button
            type="button"
            disabled={!isLeaf}
            className={`btn rounded-full border p-2 ml-2 bg-red-light
              ${!isLeaf && 'disabled'}`}
            onClick={() => onRemove(props)}>
            <Minus size={btnSize} />
          </button>
        </div>
        <PreviewCardStack
          className="ml-2"
          id={title}
          style={{width: 100, height: 120}}
        />
        <div className="flex flex-col justify-center items-center">
          <button
            type="button"
            className="btn rounded-full border p-2 ml-1 bg-blue-light"
            onClick={() => onAdd({id: uuidv1(), parent: id, date: new Date()})}>
            <Plus size={btnSize} />
          </button>
        </div>
      </div>
    </div>
  );
};

TreeNode.defaultProps = {
  title: 'New Topic',
};

// function CardTree({onAdd, onRemove, onTitleChange, ...props}) {
//   return (
//     <TreeView
//       {...props}
//       className="flex-grow overflow-x-auto overflow-y-auto"
//       indent={2}
//       nodeCont={nodeProps => (
//         <TreeNode
//           {...nodeProps}
//           onAdd={onAdd}
//           onRemove={onRemove}
//           onTitleChange={onTitleChange}
//         />
//       )}
//     />
//   );
// }
//
// CardTree.defaultProps = {};
//
// CardTree.propTypes = {};

export default function CardTreeEditorPage({
  onAdd,
  onRemove,
  onTitleChange,
  ...props
}) {
  return (
    <DefaultLayout>
      <section className="content-margin  flex flex-col flex-grow ">
        <TreeView
          {...props}
          linkOffset={3}
          indent={8}
          className="flex-grow overflow-x-auto overflow-y-auto"
          nodeCont={nodeProps => (
            <TreeNode
              {...props}
              {...nodeProps}
              onAdd={onAdd}
              onRemove={onRemove}
              onTitleChange={onTitleChange}
            />
          )}
        />
      </section>
    </DefaultLayout>
  );
}
