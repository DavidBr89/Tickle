import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as chromatic from 'd3-scale-chromatic';
import { scaleOrdinal } from 'd3';
// import hull from 'hull.js';
import hull from 'concaveman';
import * as d3 from 'd3';
import chroma from 'chroma-js';

function hexagon(x, y, w, h) {
  const x1 = x;
  const y1 = y - h;
  const x2 = x + Math.cos(Math.PI / 6) * w;
  const y2 = y - Math.sin(Math.PI / 6) * h;
  const x3 = x + Math.cos(Math.PI / 6) * w;
  const y3 = y + Math.sin(Math.PI / 6) * h;
  const x4 = x;
  const y4 = y + h;
  const x5 = x - Math.cos(Math.PI / 6) * w;
  const y5 = y + Math.sin(Math.PI / 6) * h;
  const x6 = x - Math.cos(Math.PI / 6) * w;
  const y6 = y - Math.sin(Math.PI / 6) * h;
  return [[x1, y1], [x2, y2], [x3, y3], [x4, y4], [x5, y5], [x6, y6]];
}

const groupPoints = function(nodes, offsetX = 0, offsetY = 0) {
  let fakePoints = [];
  nodes.forEach(element => {
    fakePoints = fakePoints.concat([
      // "0.7071" scale the sine and cosine of 45 degree for corner points.
      [element.x, element.y + offsetY],
      [element.x + 0.7071 * offsetX, element.y + 0.7071 * offsetY],
      [element.x + offsetX, element.y],
      [element.x + 0.7071 * offsetX, element.y - 0.7071 * offsetY],
      [element.x, element.y - offsetX],
      [element.x - 0.7071 * offsetX, element.y - 0.7071 * offsetY],
      [element.x - offsetX, element.y],
      [element.x - 0.7071 * offsetX, element.y + 0.7071 * offsetY]
    ]);
    // fakePoints = fakePoints.concat(
    //   hexagon(element.x, element.y, offsetX, offsetY)
    // );
  });

  return fakePoints.reverse();
};

class BubbleOverlay extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { data, width, height } = this.props;

    const blurFactor = 2;
    const bubbleRadius = 25;

    const colorScale = scaleOrdinal()
      .domain(data.map(s => s.key))
      .range(chromatic.schemeAccent);

    const scale = d3
      .scaleLinear()
      .domain(d3.extent(data, d => d.values.length))
      .range([20, 50])
      .nice();

    const Bubbles = data
      .filter(d => d.values.length > 1)
      .sort((a, b) => b.values.length - a.values.length)
      .map(({ id, key, values }) => {
        const size = scale(values.length);
        const hPoints = hull(groupPoints(values, 25, 25), 1.8); // d3.polygonHull(groupPoints(values));

        const p = d3.line().curve(d3.curveBasis)(hPoints);
        const color = chroma(colorScale(key)).alpha(0.1);
        return (
          <g
            key={id}
            style={
              {
                // filter: `url("#gooeyCodeFilter")`
              }
            }
          >
            <path
              stroke="black"
              d={p}
              id={`p${id}`}
              fill={color}
              opacity={0.4}
            />
          </g>
        );
      });

    return (
      <svg
        style={{
          position: 'absolute',
          width,
          height
        }}
      >
        <defs>
          <filter id={'gooeyCodeFilter'}>
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={blurFactor}
              colorInterpolationFilters="sRGB"
              result="blur"
            />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.2" />
            </feComponentTransfer>
            <feColorMatrix
              in="blur"
              mode="matrix"
              values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${bubbleRadius} -6`}
              result="gooey"
            />
          </filter>
          <filter id="gooey2">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${bubbleRadius} -7`}
              result="gooey"
            />
            <feBlend in="SourceGraphic" in2="gooey" />
          </filter>

          <filter id="gooey">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={blurFactor}
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${bubbleRadius} -7`}
              result="gooey"
            />
            <feBlend in="SourceGraphic" in2="gooey" />
          </filter>
        </defs>
        {Bubbles}
      </svg>
    );
  }
}

export default BubbleOverlay;
