import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
// import * as chromatic from 'd3-scale-chromatic';
// import hull from 'hull.js';
import hull from 'concaveman';
import * as d3 from 'd3';

// import chroma from 'chroma-js';
// import polylabel from '@mapbox/polylabel';

import { getBoundingBox, bounds, setify } from '../utils';
import { groupPoints } from './utils';

import { intersection, union, uniqBy, uniq, flatten } from 'lodash';
import TopicAnnotationOverlay from './TopicAnnotationOverlay';
import dobbyscan from './cluster';
import TagCloud from './TagCloud';

const euclDist = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

function distance(a, b) {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}

function makeTreemap({ data, width, height, padX, padY }) {
  const ratio = 2;
  const sorted = data.sort((a, b) => b.values.length - a.count);
  const treemap = d3
    .treemap()
    .size([width / ratio, height])
    .paddingInner(0)
    .round(true)
    .tile(d3.treemapSquarify.ratio(1));

  const size = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.count))
    .range([10, 25]);

  const first = { name: 'root', children: sorted };
  const root = d3.hierarchy(first).sum(d => size(d.count));

  treemap(root);
  if (!root.children) return [];
  root.children.forEach(d => {
    d.left = padX / 2 + Math.round(d.x0 * ratio);
    d.top = padY / 2 + Math.round(d.y0);

    d.width = Math.round(d.x1 * ratio) - Math.round(d.x0 * ratio) - padX / 2;
    d.height = Math.round(d.y1) - Math.round(d.y0) - padY / 2;
  });

  return root.children;
  // const padY = 10;
  // const padX = 20;
}

// function rects(quadtree) {
//   const nodes = [];
//   quadtree.visit((node, x0, y0, x1, y1) => {
//     node.x0 = x0;
//     node.y0 = y0;
//     node.x1 = x1;
//     node.y1 = y1;
//     nodes.push({ x0, y0, x1, y1, width: x1 - x0, height: y1 - y0 });
//   });
//   return nodes;
// }
//

class Cluster extends Component {
  static propTypes = {
    children: PropTypes.func,
    className: PropTypes.string,
    scale: PropTypes.number
  };

  static defaultProps = {
    children: d => d,
    className: '',
    scale: 1
  };

  // static getDerivedStateFromProps(nextProps, prevState) {
  // }

  render() {
    const {
      data,
      width,
      height,
      zoom,
      selectedTags,
      colorScale,
      comps,
      links,
      sets,
      labels,
      children
    } = this.props;

    const trData = makeTreemap({
      data: sets,
      width,
      height,
      padX: 10,
      padY: 10
    });
    // const clusters = this.findClusters();

    return (
      <div style={{ position: 'relative' }}>
        <TagCloud
          data={trData}
          width={width}
          height={height}
          padX={10}
          padY={10}
          colorScale={colorScale}
          onHover={d => console.log('yeah', d)}
        />
        {}
      </div>
    );
  }
}

export default Cluster;
