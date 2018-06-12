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

import { intersection, union, uniq } from 'lodash';
import TopicAnnotationOverlay from './TopicAnnotationOverlay';
import dobbyscan from './cluster';

const euclDist = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

function distance(a, b) {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}

function rects(quadtree) {
  const nodes = [];
  quadtree.visit((node, x0, y0, x1, y1) => {
    node.x0 = x0;
    node.y0 = y0;
    node.x1 = x1;
    node.y1 = y1;
    nodes.push({ x0, y0, x1, y1, width: x1 - x0, height: y1 - y0 });
  });
  return nodes;
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
    children: d => d,
    className: '',
    scale: 1
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { width, height, nodes, scale } = nextProps;

    // const comps = compComps(nodes, 100);
    // const logScale = d3
    //   .scalePow()
    //   .domain([1.5, 0])
    //   .range([1, 30]);

    const r = 20 / scale; // scale * (prevState.clusters.length || 1) * 30;
    // Math.abs(logScale(scale));
    // console.log('scale r', r);
    const clusters = dobbyscan([...nodes], r, n => n.x, n => n.y)
      .map((vals, i) => ({ id: i, values: vals }))
      .map(c => {
        const centerPos = findCenterPos(c.values);
        const pad = 50;
        const boundedCenterPos = [
          Math.min(Math.max(pad, centerPos[0]), width - pad),
          Math.min(Math.max(pad, centerPos[1]), height - pad)
        ];

        const sets = setify(c.values).sort(
          (a, b) => b.values.length - a.values.length
        ); // .filter(d => d.values.length > 1);
        const ext = d3.extent(sets, s => s.values.length);
        const sizeScale = d3
          .scaleLinear()
          .domain(ext)
          .range([25, 55]);

        const tags = d3
          .nest()
          .key(e => e)
          .entries(c.values.reduce((acc, v) => [...acc, ...v.tags], []))
          .sort((a, b) => b.values.length - a.values.length);

        const ids = c.values.map(e => e.id);
        const tagKeys = tags.map(e => e.key);

        const dist = 10; // Math.max(relatedComp.r, 4);
        const values = c.values.map(v => ({
          ...v,
          x: centerPos[0], // Math.min(Math.max(v.x, centerPos[0] + dist), v.x),
          y: centerPos[1] // Math.min(Math.max(v.y, centerPos[1] + dist), v.y)
        }));
        //
        return {
          ...c,
          values,
          centerPos,
          sets,
          tagKeys,
          sizeScale,
          ids
        };
      });
    return { clusters };
  }

  state = {
    clusters: [],
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

    const { clusters } = this.state;

    const blurFactor = 2;
    const bubbleRadius = 25;

    const voronoi = d3.voronoi().extent([[-1, -1], [width + 1, height + 1]]);
    // .x(d => d.centerPos[0])
    // .y(d => d.centerPos[1]);

    const cells = voronoi.polygons(clusters.map(d => d.centerPos)); // relaxedVoronoi(clusters);

    // var bandWidth = upperBand - lowerBand;
    // const contours = marchingsquares.isoContours(gridded, 20);
    //
    // console.log('isoContours', contours);
    // const ms = gcc
    // const vs = voronoi.polygons(clusters.map(d => d.centerPos));
    // console.log('ns', ns, 'vs', vs);

    const polyData = cells.map((arrObj, i) => {
      const polygon = arrObj.slice(0, arrObj.length - 1);
      const centroid = d3.polygonCentroid(polygon);
      const data = clusters[i];
      // const { data } = arrObj;
      return { ...data, centroid, polygon };
    });

    const clusteredNodes = polyData.reduce((acc, d) => {
      const curNodes = d.values.map((n, i) => {
        // TODO
        const [x, y] = d.centerPos.map(e => e + i * 9);
        return { ...n, x, y };
      });
      return [...acc, ...curNodes];
    }, []);

    const [w, h] = [150, 150];

    const sets = setify(clusteredNodes).filter(d => d.count > 0);
    d3.scale;
    // const cl = d3.scaleOrdinal
    //   .domain(sets.map(s => s.key))
    //   .range([
    //     '#ffd700',
    //     '#ffb14e',
    //     '#fa8775',
    //     '#ea5f94',
    //     '#cd34b5',
    //     '#9d02d7',
    //     '#0000ff'
    //   ]);

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
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                result="gooey"
              />
            </filter>
          </defs>
          <g filter="url(#gooeyCodeFilter)">
            {sets.map(s =>
              s.values.map(d => (
                <rect
                  x={d.x - (s.values.length * 15) / 2}
                  y={d.y - (s.values.length * 15) / 2}
                  width={s.values.length * 15}
                  height={s.values.length * 15}
                  fill={colorScale(s.key)}
                />
              ))
            )}
          </g>
          {polyData.map(d => (
            <path
              fill="none"
              stroke="grey"
              strokeLinecap="round"
              strokeDasharray="5,10,5"
              d={d3.line().curve(d3.curveLinear)(d.polygon)}
            />
          ))}
          {polyData.map(d => (
            <path
              fill="none"
              stroke="grey"
              d={`M${d.centroid}L${d.centerPos}`}
            />
          ))}
        </svg>
        {polyData.map(({ centroid: [cx, cy], centerPos: [x, y], ...d }) => {
          const angle = Math.round((Math.atan2(cy - y, cx - x) / Math.PI) * 2);
          // const trans = angle === 0 ? 100
          //     : angle === -1 ? orient.top
          //     : angle === 1 ? orient.bottom
          //     : orient.left);
          return (
            <div
              key={d.tagKeys.join('-')}
              className="p-1"
              style={{
                border: 'grey solid 1px',
                // borderRadius: '10%',
                position: 'absolute',
                transition: 'left 500ms, top 500ms',
                left: cx,
                top: cy,
                transform: `translate(${angle === 0 ? -100 : 0}%, -50%)`,
                background: 'white',
                zIndex: 100,
                maxWidth: 250,
                display: 'flex',
                flexWrap: 'wrap'
              }}
            >
              {d.tagKeys.length > 0
                ? d.tagKeys.map(t => <div className="mr-1">{`${t} `} </div>)
                : 'No tags'}
            </div>
          );
        })}
        {clusteredNodes.map(children)}
      </Fragment>
    );
  }
}

export default Cluster;
