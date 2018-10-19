import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
// import * as chromatic from 'd3-scale-chromatic';
// import hull from 'hull.js';
import hull from 'concaveman';
import * as d3 from 'd3';

// import chroma from 'chroma-js';
// import polylabel from '@mapbox/polylabel';

import { intersection, union, uniqBy, uniq, flatten } from 'lodash';
// import TopicAnnotationOverlay from './TopicAnnotationOverlay';
import dobbyscan from './dobbyScanCluster';

function getBoundingBox(coords, acc = d => [d[0], d[1]]) {
  const bounds = { minX: Infinity, maxX: 0, minY: Infinity, maxY: 0 };

  for (let j = 0; j < coords.length; j++) {
    const [x, y] = acc(coords[j]);

    bounds.minX = bounds.minX < x ? bounds.minX : x;
    bounds.maxX = bounds.maxX > x ? bounds.maxX : x;
    bounds.minY = bounds.minY < y ? bounds.minY : y;
    bounds.maxY = bounds.maxY > y ? bounds.maxY : y;
  }

  // const { leftTop, leftBottom, rightTop, rightBottom } = bounds;
  // }
  return [
    [bounds.minX, bounds.minY],
    [bounds.maxX, bounds.maxY],
    {
      leftTop: [bounds.minX, bounds.maxY],
      leftBottom: [bounds.minX, bounds.minY],
      rightTop: [bounds.maxX, bounds.maxY],
      rightBottom: [bounds.maxX, bounds.minY]
    }
  ];
}
// const euclDist = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

// function distance(a, b) {
// return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
// }

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
// , setify
//
function circle([x, y], offsetX, offsetY) {
  return [
    // "0.7071" scale the sine and cosine of 45 degree for corner points.
    [x, y + offsetY],
    // [x + 0.7071 * offsetX, y + 0.7071 * offsetY],
    [x + offsetX, y],
    // [x + 0.7071 * offsetX, y - 0.7071 * offsetY],
    [x, y - offsetX],
    // [x - 0.7071 * offsetX, y - 0.7071 * offsetY],
    [x - offsetX, y],
    [x, y]
    // [x - 0.7071 * offsetX, y + 0.7071 * offsetY]
  ];
}
function groupPoints(
  nodes,
  offsetX = 0,
  offsetY = 0,
  accessor = d => [d[0], d[1]]
) {
  return nodes.reduce(
    (acc, d) => acc.concat(circle(accessor(d), offsetX, offsetY)),
    []
  );
}
function findCenterPos(values) {
  const bbox = getBoundingBox(values, d => [d.x, d.y]);
  const poly = hull(
    groupPoints(
      [
        bbox[2].leftTop,
        bbox[2].leftBottom,
        bbox[2].rightTop,
        bbox[2].rightBottom
      ],
      // values.map(d => [d.x, d.y]),
      10,
      10
    ),
    Infinity,
    Infinity
  );
  const centerPos = d3.polygonCentroid(poly);
  return centerPos;
}

class Cluster extends Component {
  static propTypes = {
    children: PropTypes.func,
    className: PropTypes.string,
    scale: PropTypes.number
  };

  static defaultProps = {
    children: () => null,
    className: '',
    radius: 1
  };

  findClusters = () => {
    const { width, height, nodes, radius } = this.props;

    const offset = [0, 0];
    const clusters = dobbyscan({
      points: [...nodes].filter(
        d => d.x < width - offset[0] && d.y < height - offset[1]
      ),
      // TODO find real function
      radius,
      x: n => n.x,
      y: n => n.y
    }).map((values, i) => {
      const centerPos = findCenterPos(values);
      const tags = uniq(flatten(values.map(e => e.tags)));
      // const values = uniqBy(
      //   flatten(nestedValues.map(d => d.values)).map(d => ({
      //     ...d
      //   })),
      //   'id'
      // );

      return {
        id: i,
        tags,
        count: values.length,
        values,
        centerPos
      };
    });
    return clusters;
  };

  getVoronoiCells = clusters => {
    const { width, height } = this.props;

    const voronoi = d3
      .voronoi()
      .x(d => d.centerPos[0])
      .y(d => d.centerPos[1])
      .extent([[-1, -1], [width + 1, height + 1]]);

    const cells = voronoi.polygons(clusters).map(({ data, ...polygonObj }) => {
      const polygon = Object.values(polygonObj);
      const centroid = d3.polygonCentroid(polygon);
      const size = data.values.length * 30;
      return { ...data, size, centroid, polygon };
    });
    return cells;
  };

  state = {
    // clusters: [],
    links: []
  };

  render() {
    const {
      data,
      width,
      height,
      zoom,
      // selectedTags,
      colorScale,
      comps,
      links,
      nodes,
      labels,
      children
    } = this.props;

    const clusters = this.findClusters();

    return children(clusters);
  }
}

export default Cluster;
