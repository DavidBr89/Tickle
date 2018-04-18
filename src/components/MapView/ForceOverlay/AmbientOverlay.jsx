import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as chromatic from 'd3-scale-chromatic';
// import hull from 'hull.js';
import hull from 'concaveman';
import * as d3 from 'd3';
import chroma from 'chroma-js';

import { getBoundingBox } from '../utils';
import { kmeans, groupPoints } from './utils';

// import { colorScale, shadowStyle } from '../cards/styles';

// function cheapSketchyOutline(path) {
//   const j = 2;
//   let i = 0;
//   const pointsArray = [];
//
//   const ps = points(path)._path.map(d => [d[1], d[2]]);
//   let newPoint;
//   while (i < ps.length) {
//     newPoint = ps[i];
//     console.log('ps', ps, newPoint);
//     pointsArray.push({
//       x: newPoint.x + (j / 2 - Math.random() * j),
//       y: newPoint.y + (j / 2 - Math.random() * j)
//     });
//     i += j + Math.random() * j;
//   }
//   // Make sure to get the last point
//   const line = d3
//     .line()
//     .x(d => d.x)
//     .y(d => d.y)
//     .curve(d3.curveBasis);
//   return line(pointsArray);
// }
//

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

    const blurFactor = 20;
    const bubbleRadius = 50;

    // const colorScale = d3
    //   .scaleOrdinal()
    //   .domain(data.map(s => s.key))
    //   .range(chromatic.schemeAccent);

    const Bubbles = data.map((s, i) => (
      <g>
        <defs>
          <filter id={`gooey${i}`}>
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={blurFactor}
              colorInterpolationFilters="sRGB"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${bubbleRadius} -9`}
              result="gooey"
            />
          </filter>
          <linearGradient
            id="gradientRainbow"
            gradientUnits="userSpaceOnUse"
            x1="-169.30796643985775"
            y1="0"
            x2="169.30796643985775"
            y2="0"
          >
            <stop offset="0%" stopColor="#490A3D" />
            <stop offset="25%" stopColor="#BD1550" />
            <stop offset="50%" stopColor="#E97F02" />
            <stop offset="75%" stopColor="#F8CA00" />
            <stop offset="100%" stopColor="#8A9B0F" />
          </linearGradient>
        </defs>
        <g style={{ filter: `url("#gooey${i}")` }}>
          {s.values.map(d => (
            <circle
              cx={d.x}
              cy={d.y}
              fill={chroma('lightgrey').alpha(0.1)}
              r={bubbleRadius}
            />
          ))}
        </g>
        ))
      </g>
    ));

    return (
      <svg
        style={{
          position: 'absolute',
          width,
          height
        }}
      >
        <g style={{}}>{Bubbles}</g>
      </svg>
    );
  }
}

export default BubbleOverlay;
