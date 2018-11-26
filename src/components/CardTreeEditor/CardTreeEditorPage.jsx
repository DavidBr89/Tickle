import React, {memo, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Plus from 'react-feather/dist/icons/plus';
import Minus from 'react-feather/dist/icons/minus';

import uuidv1 from 'uuid/v1';

import TreeView from 'Components/utils/TreeView';
import PreviewCardStack from 'Components/cards/PreviewCardStack';

import DefaultLayout from 'Components/DefaultLayout';

const isLeaf = d => d.children.length === 0 && d.depth !== 0;

const TreeNode = ({...props}) => {
  const {id, title, onAdd, onRemove, onTitleChange, children} = props;

  console.log('ID', id);
  const btnSize = 17;

  return (
    <div className="p-1">
      <input
        className="form-control text-2xl font-bold"
        defaultValue={title}
        onChange={e => onTitleChange(e.target.value)}
      />

      <div className="flex">
        <div className="flex flex-col justify-center items-center">
          <button
            type="button"
            disabled={!isLeaf(props)}
            className={`btn rounded-full border p-2 ml-2 bg-red-light ${!isLeaf(
              props,
            ) && 'disabled'}`}
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
            className="btn rounded-full border p-2 ml-2 bg-blue-light"
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

function CardTree({onAdd, onRemove, onTitleChange, ...props}) {
  return (
    <TreeView
      {...props}
      className="flex-grow overflow-x-auto overflow-y-auto"
      nodeCont={nodeProps => (
        <TreeNode
          {...nodeProps}
          onAdd={onAdd}
          onRemove={onRemove}
          onTitleChange={onTitleChange}
        />
      )}
    />
  );
}

CardTree.defaultProps = {};

CardTree.propTypes = {};

export default function CardTreeEditorPage({...props}) {
  return (
    <DefaultLayout>
      <section className="content-margin  flex flex-col flex-grow ">
        <CardTree linkOffset={3} {...props} />
      </section>
    </DefaultLayout>
  );
}
