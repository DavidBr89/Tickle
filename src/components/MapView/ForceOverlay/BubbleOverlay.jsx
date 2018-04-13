import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as chromatic from 'd3-scale-chromatic';
// import hull from 'hull.js';
import hull from 'concaveman';
import * as d3 from 'd3';
import chroma from 'chroma-js';
import points from 'point-at-length';
import km from 'ml-kmeans';

// import { colorScale, shadowStyle } from '../cards/styles';

function kmeans(values) {
  const euclDist = (x1, y1, x2, y2) =>
    Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const dists = values.map(({ x: x1, y: y1 }) =>
    values.map(({ x: x2, y: y2 }) => [
      euclDist(x1, y1, x2, y2) > 200 ? euclDist(x1, y1, x2, y2) : 0
    ])
  );
  const clustered = km(dists, 2).clusters.map((c, i) => ({
    ...values[i],
    cluster: c
  }));

  return d3
    .nest()
    .key(d => d.cluster)
    .entries(clustered);
}

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
  return nodes.reduce(
    (acc, element) =>
      acc.concat([
        // "0.7071" scale the sine and cosine of 45 degree for corner points.
        [element.x, element.y + offsetY],
        [element.x + 0.7071 * offsetX, element.y + 0.7071 * offsetY],
        [element.x + offsetX, element.y],
        [element.x + 0.7071 * offsetX, element.y - 0.7071 * offsetY],
        [element.x, element.y - offsetX],
        [element.x - 0.7071 * offsetX, element.y - 0.7071 * offsetY],
        [element.x - offsetX, element.y],
        [element.x - 0.7071 * offsetX, element.y + 0.7071 * offsetY]
      ]),
    []
  );
};

function Step(context) {
  this._context = context;
  this._t = 0;
}

Step.prototype = {
  areaStart() {
    this._line = 0;
  },
  areaEnd() {
    this._line = NaN;
  },
  lineStart() {
    this._x = this._y = NaN;
    this._point = 0;
  },
  lineEnd() {
    if (this._line || (this._line !== 0 && this._point === 1))
      this._context.closePath();
    if (this._line >= 0) (this._t = 1 - this._t), (this._line = 1 - this._line);
  },
  point(x, y) {
    (x = +x), (y = +y);
    switch (this._point) {
      case 0: {
        this._point = 1;
        this._context.moveTo(x, y);
        break;
      }
      case 1:
        this._point = 2; // proceed
      default: {
        if (this._t <= 0) {
          console.log(this._y);

          let xN = Math.abs(x - this._x) * 0.25,
            yN = Math.abs(y - this._y) * 0.25,
            mYb = this._y < y ? this._y + yN : this._y - yN,
            mYa = this._y > y ? y + yN : y - yN;

          this._context.quadraticCurveTo(this._x, this._y, this._x, mYb);
          this._context.lineTo(this._x, mYa);
          this._context.quadraticCurveTo(this._x, y, this._x + xN, y);
          this._context.lineTo(x - xN, y);
          // this._context.quadraticCurveTo(x, y, x, mY);
        } else {
          const x1 = this._x * (1 - this._t) + x * this._t;
          this._context.moveTo(x1, this._y);
          this._context.lineTo(x1, y);
        }
        break;
      }
    }
    (this._x = x), (this._y = y);
  }
};

const stepRound = function(context) {
  return new Step(context);
};

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
function curveStepOutside(context) {
  let y0, i;
  return {
    lineStart() {
      (y0 = NaN), (i = 0);
    },
    lineEnd() {},
    point(x, y) {
      (x -= y0 > y ? +0.5 : -0.5), (y -= 0.5);
      if (++i === 1) context.moveTo(x, (y0 = y));
      else context.lineTo(x, y0), context.lineTo(x, (y0 = y));
    }
  };
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
    const { data, width, height, zoom, selectedTags, colorScale } = this.props;
    console.log('selectedTags', selectedTags);

    const blurFactor = 2;
    const bubbleRadius = 25;

    // const colorScale = d3
    //   .scaleOrdinal()
    //   .domain(data.map(s => s.key))
    //   .range(chromatic.schemeAccent);

    const offsetScale = d3
      .scaleQuantize()
      .domain([10, 1])
      .range(d3.range(30, 60, 5))
      .nice();

    const dashScale = d3
      .scaleQuantize()
      .domain(d3.extent(data, d => d.values.length))
      .range([7, 4, 3, 2])
      .nice();

    const Bubbles = data
      .filter(d => d.values.length > 1)
      .sort((a, b) => b.values.length - a.values.length)
      .map(({ id, key, values }) => {
        const size = offsetScale(values.length);
        const clusters = kmeans(values);
        console.log('clusters', clusters);

        const hulls = clusters.map(c =>
          hull(groupPoints(c.values, size, size), 1, 100)
        ); // d3.polygonHalues));

        const color = chroma(colorScale(key)).alpha(0.1);
        return (
          <g key={id}>
            {hulls.map(h => (
              <path
                style={{
                  stroke: color,
                  strokeDasharray: dashScale(zoom),
                  strokeDashoffset: 30,
                  strokeWidth: dashScale(zoom)
                }}
                d={d3.line().curve(d3.curveStep)(h)}
                id={`p${id}`}
                fill={color}
                opacity={selectedTags.includes(key) ? 1 : 0.4}
              />
            ))}
          </g>
        );
      });

    const circles = data.map(b =>
      b.values.map(d => <circle cx={d.x} cy={d.y} fill="black" r="15" />)
    );
    console.log('circles', circles);
    return (
      <svg
        style={{
          position: 'absolute',
          width,
          height
        }}
      >
        {Bubbles}
      </svg>
    );
  }
}

export default BubbleOverlay;
