import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as chromatic from 'd3-scale-chromatic';
import { scaleOrdinal } from 'd3';
import { layout } from 'd3-geom-concavehull/';
import * as d3 from 'd3';
import chroma from 'chroma-js';

const groupPoints = function(nodes, offset = 5) {
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

    const blurFactor = 5;
    const bubbleRadius = 25;

    const color = scaleOrdinal()
      .domain(data.map(s => s.key))
      .range(chromatic.schemeAccent);

    const Bubbles = data.map(({ id, key, values }) => {
      const hull = layout
        .concaveHull()
        .distance(1000)
        .padding(50);

      const vals = values.map(({ x, y }) => [x, y]);
      const hPoints = d3.polygonHull(groupPoints(values));
      const p = d3.line().curve(d3.curveBasis)(hPoints);
      // console.log('hPoints', hPoints, 'p', p);
      return (
        <g
          key={id}
          style={{
            filter: `url("#gooeyCodeFilter")`
          }}
        >
          <path d={p} fill={chroma(color(key)).alpha(1)} />
          {values.map(d => (
            <rect
              fill={chroma(color(key)).alpha(1)}
              opacity={1}
              width={bubbleRadius * 2}
              height={bubbleRadius * 2}
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
              result="blur"
            />
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
