import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as d3 from 'd3';

const treeData = {
  name: 'Top Level',
  children: [
    {
      name: 'Level 2: A',
      children: [{ name: 'Son of A' }, { name: 'Daughter of A' }]
    },
    { name: 'Son of A' },
    { name: 'Daughter of A' },
    { name: 'Son of A' },
    { name: 'Daughter of A' },
    { name: 'Son of A' },
    { name: 'Daughter of A' },
    { name: 'Son of A' },
    { name: 'Daughter of A' },
    {
      name: 'Level 2: B',
      children: [{ name: 'Son of A' }, { name: 'Daughter of A' }]
    }
  ]
};

class Tree extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {className, style}=  this.props;
    // set the dimensions and margins of the diagram
    // let margin = { top: 40, right: 90, bottom: 50, left: 90 },
    //   width = 660 - margin.left - margin.right,
    //   height = 500 - margin.top - margin.bottom;

    const nodeWidth = 200;
    const nodeHeight = 200;
    const yPad = 100;
    const xPad = 20;
    // declares a tree layout and assigns the size
    const treemap = d3.tree().nodeSize([nodeWidth + xPad, nodeHeight + yPad]);

    //  assigns the data to a hierarchy using parent-child relationships
    const hierarchyData = d3.hierarchy(treeData);
    console.log('hierarchyData', hierarchyData);

    // maps the node data to the tree layout
    const nodes = treemap(hierarchyData);
    console.log('Nodes', nodes);
    const descendants = nodes.descendants();

    return (
      <div className={className} style={{ ...style, position: 'relative' }}>
        <div style={{ transform: 'translateX(100%)' }}>
          <div>
            {descendants.map(n => (
              <div
                style={{
                  transform: 'translate(50%, 50%)',
                  position: 'absolute',
                  left: n.x,
                  top: n.y,
                  width: nodeWidth,
                  height: nodeHeight,
                  border: '1px solid blue'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Tree;
