import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as d3 from 'd3';

import Dimensions from 'Components/utils/DimensionsWrapper';

import PreviewCardStack from 'Components/cards/PreviewCardStack';

const treeData = {
  tag: 'Top Level',
  values: [],
  children: [
    {
      tag: 'Level 2: A',
      values: [],
      children: [
        { tag: 'Son of A', values: [] },
        { tag: 'Daughter of A', values: [] }
      ]
    },
    { tag: 'Daughter of A', values: [] },
    { tag: 'Son of A', values: [] },
    { tag: 'Daughter of A', values: [] },
    {
      tag: 'Level 2: B',
      values: [],
      children: [
        { tag: 'Son of A', values: [] },
        { tag: 'Daughter of A', values: [] }
      ]
    }
  ]
};

class Tree extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    nodeWidth: PropTypes.number,
    nodeHeight: PropTypes.number
  };

  static defaultProps = {
    nodeHeight: 200,
    nodeWidth: 180,
    yPad: 100,
    xPad: 20
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      className,
      style,
      nodeWidth,
      nodeHeight,
      xPad,
      yPad,
      width,
      height
    } = this.props;

    const nw = width / 5;
    const nh = height / 5;
    // set the dimensions and margins of the diagram
    // let margin = { top: 40, right: 90, bottom: 50, left: 90 },
    //   width = 660 - margin.left - margin.right,
    //   height = 500 - margin.top - margin.bottom;

    const tree = d3
      .tree()
      .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth)
      // .size([width, height]);
      .nodeSize([nw + xPad, nh + yPad]);

    //  assigns the data to a hierarchy using parent-child relationships
    const hierarchyData = d3.hierarchy(treeData);
    // console.log('hierarchyData', hierarchyData);

    // maps the node data to the tree layout
    const root = tree(hierarchyData);
    // console.log('Nodes', nodes);
    const descendants = root.descendants();

    console.log('descendants', descendants);
    const links = tree(root).links();
    const drawLink = d3
      .linkHorizontal()
      .x(d => d.x + width / 2)
      .y(d => d.y + nh);

    //  var link = g.selectAll(".link")
    //     .data()
    //     .enter().append("path")
    //       .attr("class", "link")
    //       .attr("d", ;

    return (
      <div
        className={`${className} flex flex-col`}
        style={{
          ...style,
          position: 'relative',
          overflow: 'scroll',
          height,
          width
          // transform: `translate(${root.x}px, ${root.y}px)`
          // height: 1000
        }}
      >
        <svg
          className="absolute"
          style={{
            width: width * 2,
            height: height* 2
            // transform: `translate(${nw / 2}px, ${nh / 2}px)`
          }}
        >
          {links.map(l => (
            <path d={drawLink(l)} style={{ fill: 'none', stroke: 'black' }} />
          ))}
        </svg>
        <div
          className="flex-grow "
          style={
            {
              // transform: 'translateX(50%)'
            }
          }
        >
          <div className="">
            {descendants.map(({ data, ...n }) => (
              <PreviewCardStack
                name={data.tag}
                key={data.tag}
                {...data}
                style={{
                  transform: 'translate(-50%,50%)',
                  position: 'absolute',
                  left: n.x + width / 2,
                  top: n.y,
                  width: nw,
                  height: nh
                  // border: '1px solid blue'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const TreeWrapper = ({ ...props }) => (
  <Dimensions style={{ position: 'absolute' }}>
    {(w, h) => <Tree {...props} width={w} height={h} />}
  </Dimensions>
);

export default TreeWrapper;
