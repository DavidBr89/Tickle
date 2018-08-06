import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as chromatic from 'd3-scale-chromatic';
// import hull from 'hull.js';
import hull from 'concaveman';
import * as d3 from 'd3';
import chroma from 'chroma-js';
import km from 'ml-kmeans';

import {
  Annotation,
  // SubjectThreshold,
  // ConnectorElbow,
  Note
} from 'react-annotation';

import { getBoundingBox } from '../utils';
// import polyOffset from './polyOffset';

// import { colorScale, shadowStyle } from '../cards/styles';

function kmeans(values) {
  const euclDist = (x1, y1, x2, y2) =>
    Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const dists = values.map(({ x: x1, y: y1 }) =>
    values.map(({ x: x2, y: y2 }) => [euclDist(x1, y1, x2, y2)])
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
class TopicAnnotationOverlay extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { data, selectedTags, colorScale, comps } = this.props;

    // const TopicLabels = comps.map(({ key, values }, i) => {
    //   const h = hull(groupPoints(values, 20, 30), 10, 100);
    //   return (
    //     <g key={`${key}comp1`}>
    //       <path
    //         style={{
    //           stroke: 'black'
    //         }}
    //         strokeWidth="1"
    //         d={d3.line().curve(d3.curveStep)(h)}
    //         fill={'none'}
    //       />
    //     </g>
    //   );
    // });
    return (
      <g>
        {comps.map(({ values, key, tagKeys, centroid, centerPos }, i) => (
          <Annotation
            key={key}
            x={centerPos[0]}
            y={centerPos[1]}
            dy={-30}
            dx={10}
            color="black"
            title={`#${i}`}
            label={tagKeys.join(',')}
          />
        ))}
      </g>
    );
  }
}

export default TopicAnnotationOverlay;
