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
  const ratio = 1.5;
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
    .range([5, 25]);

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

function Tooltip({
  coords: [x, y],
  colorScale,
  tags,
  centroid: [cx, cy],
  size,
  ...props
}) {
  const dist = euclDist(cx, x, cy, y) || null;
  const angle = Math.round((Math.atan2(cy - y, cx - x) / Math.PI) * 2);
  const translate =
    angle === 0
      ? '00%, 0'
      : angle === -1
        ? '0, -50%'
        : angle === 1
          ? '0, -50%'
          : '-00%, 0';
  return (
    <div
      key={tags.join('-')}
      style={{
        // borderRadius: '10%',
        position: 'absolute',
        transition: 'left 500ms, top 500ms',
        left: dist ? cx : x,
        top: dist ? cy : y,
        transform: `translate(${translate})`,
        background: 'white',
        zIndex: 100,
        maxWidth: 250,
        display: 'flex',
        flexWrap: 'wrap'
      }}
    >
      <div className="m-1">
        <div className="p-1" style={{ border: 'grey dashed 2px' }}>
          {tags.map(t => (
            <div
              className="mr-1"
              style={{ fontSize: size, background: colorScale(t) }}
            >
              {`${t} `}{' '}
            </div>
          ))}
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

    const clusters = dobbyscan({
      points: [...nodes],
      // TODO find real function
      radius: d => r,
      x: n => n.x,
      y: n => n.y
    }).map((nestedValues, i) => {
      const centerPos = findCenterPos(nestedValues);
      const tags = flatten(intersection(nestedValues.map(e => e.tag)));
      const values = uniqBy(
        flatten(nestedValues.map(d => d.values)).map(d => ({
          ...d,
          x: centerPos[0],
          y: centerPos[1]
        })),
        'id'
      );

      return {
        id: i,
        tags,
        count: values.length,
        nestedValues,
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
      children
    } = this.props;

    const trData = makeTreemap({
      data: nodes,
      width,
      height,
      padX: 10,
      padY: 20
    });
    console.log('trData', nodes, trData);
    // const clusters = this.findClusters();

    // function collisionCheck(base_rect, new_rect) {
    //   const padding = 5;
    //   if (
    //     base_rect.x < new_rect.x - padding + new_rect.w + padding * 2 &&
    //     base_rect.x + base_rect.w > new_rect.x - padding &&
    //     base_rect.y < new_rect.y - padding + new_rect.h + padding * 2 &&
    //     base_rect.h + base_rect.y > new_rect.y - padding
    //   ) {
    //     return true;
    //   }
    //   return false;
    // }
    //
    // const number_of_pictures = 10;
    // const state = { pictures: [] };
    //
    // const m = 10;
    // const center = { x: width / 2 / m, y: (height * 2) / 3 / m };
    // function findNext() {
    //   let i = 0;
    //   const dist = 0.01;
    //   let angle = 0;
    //   while (i < 90000) {
    //     i += 1;
    //     // Spiral code from https://stackoverflow.com/questions/6824391/drawing-a-spiral-on-an-html-canvas-using-javascript
    //     const incr = angle ? 1 / (dist + dist * angle) / 2 : dist;
    //     const x = (dist + dist * angle) * Math.cos(angle) + center.x;
    //     const y = (dist + dist * angle) * Math.sin(angle) + center.y;
    //     const temp_w = 120 / m; // Math.random() * 30 + 5;
    //     const temp_h = temp_w;
    //     const temp_rect = {
    //       x: x - temp_w / 2,
    //       y: y - temp_h / 2,
    //       w: temp_w,
    //       h: temp_h,
    //       i
    //     };
    //     const checks = [];
    //     for (const pict of state.pictures) {
    //       const check = collisionCheck(pict, temp_rect);
    //       checks.push(!check);
    //     }
    //
    //     if (checks.every(val => val === true)) {
    //       state.pictures.push(temp_rect);
    //       break;
    //     }
    //     angle += incr;
    //   }
    // }
    //
    // for (let j = 0; j < number_of_pictures; j++) {
    //   findNext();
    // }
    // console.log('state pic', state.pictures);

    return (
      <div style={{ position: 'relative' }}>
        <TagCloud
          data={trData}
          width={width}
          height={height}
          padX={10}
          padY={10}
          onHover={d => console.log('yeah', d)}
        />
      </div>
    );
  }
}

export default Cluster;
