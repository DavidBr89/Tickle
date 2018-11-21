import React from 'react';
import PropTypes from 'prop-types';

import TreeView from 'Components/utils/TreeView';
import PreviewCardStack from 'Components/cards/PreviewCardStack';

function CardTree({...props}) {
  const node = ({id}) => (
    <div className="">
      <div className="text-2xl font-bold">{id}</div>
      <PreviewCardStack id={id} style={{width: 100, height: 120}} />
    </div>
  );
  return <TreeView {...props} node={node} />;
}

CardTree.defaultProps = {};

CardTree.propTypes = {};

export default CardTree;
