import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as chromatic from 'd3-scale-chromatic';
import { scaleOrdinal } from 'd3';

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
    const bubbleRadius = 40;

    const color = scaleOrdinal()
      .domain(data.map(s => s.key))
      .range(chromatic.schemeAccent);

    const Bubbles = data.map(({ id, key, values }) => (
      <g
        key={id}
        style={{
          // filter: `url( "#gooeyCodeFilter-${key}")`,
          filter: `url("#gooeyCodeFilter")`
        }}
      >
        {values.map(d => (
          <rect
            fill={color(key)}
            opacity={0.2}
            width={bubbleRadius * 2}
            height={bubbleRadius * 2}
            x={d.x - bubbleRadius}
            y={d.y - bubbleRadius}
          />
        ))}
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
        <defs>
          <filter id={'gooeyCodeFilter'}>
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={blurFactor}
              colorInterpolationFilters="sRGB"
              result="blur"
            />
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0 0.15"
              numOctaves="1"
              in="blur"
              result="warp"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${bubbleRadius} -6`}
              result="gooey"
            />

            <feComposite
              in="SourceGraphic"
              in2="gooey"
              operator="atop"
              result="goo"
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
