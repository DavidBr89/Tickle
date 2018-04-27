import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as chromatic from 'd3-scale-chromatic';
// import hull from 'hull.js';
import hull from 'concaveman';
import * as d3 from 'd3';
import chroma from 'chroma-js';
import polylabel from '@mapbox/polylabel';

import { getBoundingBox } from '../utils';
import { kmeans, groupPoints } from './utils';

import throttle from 'react-throttle-render';

function shapeBounds(coordinates) {
  let left = [Infinity, 0];
  let right = [-Infinity, 0];
  let top = [0, Infinity];
  let bottom = [0, -Infinity];
  coordinates.forEach(d => {
    left = d[0] < left[0] ? d : left;
    right = d[0] > right[0] ? d : right;
    bottom = d[1] > bottom[1] ? d : bottom;
    top = d[1] < top[1] ? d : top;
  });
  return { center: polylabel([coordinates]), top, left, right, bottom };
}

function contouring({ data, width, height }) {
  // console.log('contour data', data);
  // const { resolution = 500, thresholds = 10, bandwidth = 20 } = areaType;
  const resolution = 500;
  const thresholds = 10;
  const bandwidth = 20;

  const xScale = d3
    .scaleLinear()
    .domain([0, width])
    .rangeRound([0, resolution])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain([0, height])
    .rangeRound([resolution, 0])
    .nice();

  const contourProjectedAreas = d3
    .contourDensity()
    .size([resolution, resolution])
    .x(d => xScale(d[0]))
    .y(d => yScale(d[1]))
    .thresholds(thresholds)
    .bandwidth(bandwidth)(data);

  // console.log('contourProjectedAreas', contourProjectedAreas);

  const areas = contourProjectedAreas.map(area => {
    // area.parentArea = contourData;
    area.bounds = [];
    area.coordinates.forEach(poly => {
      poly.forEach((subpoly, i) => {
        poly[i] = subpoly.map(coordpair => {
          coordpair = [
            xScale.invert(coordpair[0]),
            yScale.invert(coordpair[1])
          ];
          return coordpair;
        });
        // Only push bounds for the main poly, not its interior rings, otherwise you end up labeling interior cutouts
        if (i === 0) {
          area.bounds.push(Object.values(shapeBounds(poly[i])));
        }
      });
    });
    return area;
  });

  return areas;
}

function recenterVoronoi(nodes, width, height) {
  const shapes = [];
  const voronoi = d3
    .voronoi()
    .x(d => d.x)
    .y(d => d.y)
    .extent([[-1, -1], [width + 1, height + 1]]);

  const vs = voronoi.polygons(nodes);
  console.log('vs', vs);

  vs.forEach(d => {
    if (!d.length) return;
    const n = [];
    d.forEach(c => {
      console.log('c', c, 'd', d);
      n.push([c[0] - d[0], c[1] - d[1]]);
    });
    n.point = d;
    shapes.push(n);
  });
  console.log('shapes', shapes);
  return shapes;
}

class BubbleOverlay extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      data,
      width,
      height,
      zoom,
      selectedTags,
      colorScale,
      comps
    } = this.props;

    const blurFactor = 2;
    const bubbleRadius = 25;

    // const colorScale = d3
    //   .scaleOrdinal()
    //   .domain(data.map(s => s.key))
    //   .range(chromatic.schemeAccent);

    const offsetScale = d3
      .scaleLinear()
      .domain(d3.extent(data, d => d.values.length))
      // .range(d3.range(30, 90, 15))
      .range([15, 70])
      .nice();

    const dashScale = d3
      .scaleQuantize()
      .domain(d3.extent(data, d => d.values.length))
      .range([7, 4, 3, 2])
      .nice();

    // TODO: make contour

    const bubbleData = data
      .filter(d => d.values.length > 1)
      .sort((a, b) => b.values.length - a.values.length);

    const bubbleNodes = bubbleData.reduce(
      (acc, d) => [...d.values, ...acc],
      []
    );
    console.log('bubbleNodes', bubbleNodes);

    const vors = d3
      .voronoi()
      .x(d => d.x)
      .y(d => d.y)
      .extent([[-1, -1], [width + 1, height + 1]])
      .polygons(bubbleNodes);

    console.log('vors', vors);

    const Cells = vors.map(v => (
      <path
        id={`cell${v.data.id}`}
        d={v == null ? null : `M${v.join('L')}Z`}
        stroke={'none'}
        fill="none"
      />
    ));

    const size = d3
      .scaleLinear()
      .domain(d3.extent(data, d => d.values.length))
      .range([50, 200]);

    const Bubbles = bubbleData.map(({ id, key, values }) => {
      // const size = offsetScale(values.length);
      // const bbox = getBoundingBox(values, d => [d.x, d.y]);
      // const distY = bbox[1][1] - bbox[0][1];
      // const distX = bbox[1][0] - bbox[0][0];

      const [w, h] = [200, 200];
      const color = chroma(colorScale(key)).alpha(0.1);
      return (
        <g key={id} style={{ filter: 'url(#fancy-goo)' }}>
          {values.map(v => {
            const s = size(values.length);
            return (
              <g>
                <clipPath id={`clip-${v.id}`}>
                  <use xlinkHref={`#cell${v.id}`} />
                </clipPath>
                <rect
                  width={s}
                  height={s}
                  x={v.x - s / 2}
                  y={v.y - s / 2}
                  fill={color}
                  clipPath={`url(#clip-${v.id})`}
                />
              </g>
            );
          })}
        </g>
      );
    });

    const blurfactor = 1.9;
    const radius = 20;
    return (
      <svg
        style={{
          position: 'absolute',
          width,
          height
        }}
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={blurfactor * radius}
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
          <filter id="fancy-goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${radius} -9`}
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
        {Bubbles}
        {Cells}
      </svg>
    );
  }
}

export default BubbleOverlay;
