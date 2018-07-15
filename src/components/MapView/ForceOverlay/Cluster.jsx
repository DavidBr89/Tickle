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

const euclDist = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

function distance(a, b) {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
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
      20,
      20
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

    const clusters = dobbyscan({
      points: [...nodes],
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
    const cells = this.getVoronoiCells(clusters);

    return (
      <Fragment>
        <svg
          style={{
            position: 'absolute',
            width,
            height
          }}
        >
          {cells.map(d => (
            <path
              fill="none"
              stroke="none"
              strokeLinecap="round"
              strokeDasharray="5,10,5"
              d={d3.line().curve(d3.curveLinear)(d.polygon)}
            />
          ))}
        </svg>
        {cells.map(({ centroid, centerPos, ...d }) =>
          children({ centroid, centerPos, data: d })
        )}
      </Fragment>
    );
  }
}

export default Cluster;
