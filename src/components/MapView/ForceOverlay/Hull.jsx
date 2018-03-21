import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import chroma from 'chroma-js';

import lap from 'lap-jv/lap.js';

const pathStr = points => d3.line().curve(d3.curveBasisClosed)(points);

function groupPath(nodes, offset = 1) {
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
  return d3.polygonHull(fakePoints).reverse();
}

const polyDim = points => {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  // for(int i = 0; i < points.length; i += 2) {
  points.forEach((d, i) => {
    const x = points[i][0];
    const y = points[i][1];
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  });
  const width = maxX - minX;
  const height = maxY - minY;
  return { width, height };
};

class Hull extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    className: PropTypes.string,
    offset: PropTypes.number.isRequired,
    zoomHandler: PropTypes.func.isRequired,
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { selected: false };
  }

  render() {
    const {
      data,
      offset,
      className,
      zoomHandler,
      onMouseEnter,
      onMouseLeave,
      onHighlight,
      tags
    } = this.props;
    const { selected } = this.state;
    const hull = groupPath(data, offset);
    const center = d3.polygonCentroid(hull);

    const dim = polyDim(hull);
    const left = center[0] + dim.width * 1 / 4;
    const top = center[1];
    return (
      <path
        className={className}
        fill={chroma('white')
          .alpha(0)
          .css()}
        stroke="black"
        strokeWidth={selected ? '2px' : 0}
        d={pathStr(hull)}
        // onMouseOver={() => console.log('yeah')}
        onMouseEnter={() => {
          this.setState(state => ({ selected: !state.selected }));
          // onMouseEnter({
          //   left: left +10,
          //   top,
          //   // TODO: rename
          //   doc: { tags }
          // });
        }}
        onMouseLeave={e => {
          onMouseLeave(null);
        }}
        onClick={() => {
          onHighlight(data.map(d => d.id));
          zoomHandler({
            left,
            top,
            w: dim.width + dim.width * 1 / 3, // 1d3.polygonLength(hull),
            h: dim.height // d3.polygonLength(hull)
          });
        }}
      />
    );
  }
}
export default Hull;
