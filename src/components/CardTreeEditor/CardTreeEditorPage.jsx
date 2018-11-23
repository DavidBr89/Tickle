import React, {memo, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Plus from 'react-feather/dist/icons/plus';
import {stratify} from 'd3';

import TreeView from 'Components/utils/TreeView';
import PreviewCardStack from 'Components/cards/PreviewCardStack';

import DefaultLayout from 'Components/DefaultLayout';

function CardTree({onAdd, ...props}) {
  const node = ({id}) => (
    <div className="p-1 ">
      <div className="flex items-center">
        <div className="text-2xl font-bold ">{id}</div>
        <button
          type="button"
          className="ml-1 btn"
          onClick={() => onAdd({id: Math.random(), parent: id})}>
          <Plus />
        </button>
      </div>
      <PreviewCardStack id={id} style={{width: 100, height: 120}} />
    </div>
  );
  return (
    <TreeView
      {...props}
      className="flex-grow overflow-x-auto overflow-y-auto"
      node={node}
    />
  );
}

CardTree.defaultProps = {};

CardTree.propTypes = {};

export default function CardTreeEditorPage({tagTree, setTagTree, ...props}) {
  const [treeData, setTreeData] = useState(tagTree);

  var root = stratify()
    .id(d => d.id)
    .parentId(d => d.parent)(treeData);

  return (
    <DefaultLayout>
      <section className="content-margin flex flex-col flex-grow">
        <CardTree
          linkOffset={3}
          {...props}
          {...root}
          onAdd={n => setTreeData([...treeData, n])}
        />
      </section>
    </DefaultLayout>
  );
}
