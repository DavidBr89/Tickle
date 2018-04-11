import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as chromatic from 'd3-scale-chromatic';
import { scaleOrdinal } from 'd3';
import hull from 'hull.js';
import * as d3 from 'd3';
import chroma from 'chroma-js';

const groupPoints = function(nodes, offset = 0) {
  let fakePoints = [];
  nodes.forEach(element => {
    fakePoints = fakePoints.concat([
      // "0.7071" scale the sine and cosine of 45 degree for corner points.
      [element.x, element.y + offset],
      [element.x + 0.7071 * offset, element.y + 0.7071 * offset],
      [element.x + offset, element.y],
      [element.x + 0.7071 * offset, element.y - 0.7071 * offset],
      [element.x, element.y - offset],
      [element.x - 0.7071 * offset, element.y - 0.7071 * offset],
      [element.x - offset, element.y],
      [element.x - 0.7071 * offset, element.y + 0.7071 * offset]
    ]);
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

    const blurFactor = 12;
    const bubbleRadius = 25;

    const colorScale = scaleOrdinal()
      .domain(data.map(s => s.key))
      .range(chromatic.schemeAccent);

    const Bubbles = data.map(({ id, key, values }) => {
      const hPoints = hull(groupPoints(values, 13), 50); // d3.polygonHull(groupPoints(values));

      const p = d3.line()(hPoints);
      const color = chroma(colorScale(key)).alpha(0.1);
      return (
        <g
          key={id}
          xlinkHref={`#p${id}`}
          style={{
            filter: `url("#gooeyCodeFilter")`
          }}
        >
          <path d={p} id={`p${id}`} fill={color} opacity={0.5} />
          {values.map(d => (
            <rect
              fill={color}
              opacity={0.5}
              width={bubbleRadius }
              height={bubbleRadius }
              x={d.x - bubbleRadius}
              y={d.y - bubbleRadius}
            />
          ))}
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
