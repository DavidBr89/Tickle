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

    const Bubbles = data
      .filter(d => d.values.length > 2)
      .sort((a, b) => b.values.length - a.values.length)
      .map(({ id, key, values }) => {
        const size = offsetScale(values.length);
        const bbox = getBoundingBox(values, d => [d.x, d.y]);
        const distY = bbox[1][1] - bbox[0][1];
        const distX = bbox[1][0] - bbox[0][0];

        // const clusters =
        //   distY > height * 4 / 6 || distX > width * 4 / 6
        //     ? kmeans(values)
        //     : [{ values }];

        const projectedValues = contouring({
          data: values.map(d => [d.x, d.y]),
          width,
          height
        });

        // console.log('projected values', projectedValues);

        // [{ values }];
        // const clusters =
        //   distY > 0 || distX > 0
        //     ? [
        //       { values: values.filter(d => d.y >= cutY) },
        //       { values: values.filter(d => d.y < cutY) },
        //         { values: values.filter(d => d.x >= cutX) },
        //         { values: values.filter(d => d.x < cutX) }
        //     ]
        //     : [{ values }];
        // console.log('clusters', clusters);

        // const hulls = clusters.map(c =>
        //   hull(groupPoints(values, size, size), 1, 100)
        // ); // d3.polygonHalues));

        const color = chroma(colorScale(key)).alpha(0.1);
        return (
          <g key={id}>
            {projectedValues.map(b =>
              b.coordinates.map(p => (
                <g>
                  <path
                    style={{
                      stroke: 'black'
                    }}
                    fill="none"
                    opacity={0.5}
                  />
                  <path
                    style={{
                      stroke: color,
                      strokeDasharray: dashScale(zoom),
                      strokeDashoffset: 30,
                      strokeWidth: dashScale(zoom)
                    }}
                    d={d3.line().curve(d3.curveStep)(p[0])}
                    id={`p${id}`}
                    fill={color}
                    opacity={0.6}
                  />
                </g>
              ))
            )}
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
        {Bubbles}
      </svg>
    );
  }
}

export default BubbleOverlay;
