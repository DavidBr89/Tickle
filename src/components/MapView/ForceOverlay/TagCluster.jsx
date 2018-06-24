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

function Tooltip({ centerX: cx, centerY: cy, tags, x, y, ...props }) {
  const angle = Math.round((Math.atan2(cy - y, cx - x) / Math.PI) * 2);
  // TODO
  const dist = euclDist(cx, x, cy, y) || null;
  return (
    <div
      key={tags.join('-')}
      style={{
        // borderRadius: '10%',
        position: 'absolute',
        transition: 'left 500ms, top 500ms',
        left: dist ? cx : x,
        top: dist ? cy : y,
        transform: `translate(${angle === 0 ? -100 : 0}%, -50%)`,
        background: 'white',
        zIndex: 100,
        maxWidth: 250,
        display: 'flex',
        flexWrap: 'wrap'
      }}
    >
      <div className="m-1">
        <div className="p-1" style={{ border: 'grey dashed 2px' }}>
          {tags.length > 0
            ? tags.map(t => <div className="mr-1">{`${t} `} </div>)
            : 'Other'}
        </div>
      </div>
    </div>
  );
}
Tooltip.defaultProps = {};
Tooltip.propTypes = {};

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

  findClusters = () => {
    const { width, height, nodes, scale } = this.props;

    const r = 39 / scale; // scale * (prevState.clusters.length || 1) * 30;

    console.log('nodes', nodes);
    const clusters = dobbyscan({
      points: [...nodes],
      // TODO find real function
      radius: d => r,
      x: n => n.x,
      y: n => n.y
    }).map((nestedValues, i) => {
      const centerPos = findCenterPos(nestedValues);
      const tags = uniq(flatten(intersection(nestedValues.map(e => e.tags))));
      const values = uniqBy(flatten(nestedValues.map(d => d.values)), 'id');

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
      selectedTags,
      colorScale,
      comps,
      links,
      nodes,
      labels,
      children,
      filterSet
    } = this.props;

    const clusters = this.findClusters();
    console.log('clusters', clusters);
    const cells = this.getVoronoiCells(clusters);

    const blurFactor = 2;
    const bubbleRadius = 25;

    return (
      <Fragment>
        <svg
          style={{
            position: 'absolute',
            width,
            height
          }}
        >
          <defs>
            <filter id="gooey">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="10"
                colorInterpolationFilters="sRGB"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                result="goo"
              />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
            <filter id="gooeyCodeFilter">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="10"
                colorInterpolationFilters="sRGB"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${20} -7`}
                result="gooey"
              />
            </filter>
          </defs>
          {cells.map(d => (
            <path
              fill="none"
              stroke="grey"
              strokeLinecap="round"
              strokeDasharray="5,10,5"
              d={d3.line().curve(d3.curveLinear)(d.polygon)}
            />
          ))}
          {cells.map(d => (
            <path
              fill="none"
              stroke="grey"
              d={`M${d.centroid}L${d.centerPos}`}
            />
          ))}
        </svg>
        {cells.map(({ centroid: [cx, cy], centerPos: [x, y], tags, ...d }) => (
          <Tooltip centerX={cx} centerY={cy} x={x} y={y} tags={tags} />
        ))}
        {cells.map(d => (
          <div
            style={{
              position: 'absolute',
              left: d.centerPos[0] - d.size / 2,
              top: d.centerPos[1] - d.size / 2,
              transition: 'left 50ms, top 50ms, width 500ms, height 500ms',
              width: d.size,
              height: d.size,
              border: 'grey 4px solid',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            r={d.values.length * 20}
            cx={d.centerPos[0]}
            cy={d.centerPos[1]}
          >
            {d.values.length}
          </div>
        ))}
      </Fragment>
    );
  }
}

export default Cluster;
