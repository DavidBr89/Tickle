import React, { Component } from 'react';
import PropTypes from 'prop-types';

import memoize from 'memoize-one';

import * as d3 from 'd3';

import lap from 'lap-jv/lap.js';
import SOM from 'ml-som';
import setify from 'Utils/setify';
import DimWrapper from 'Utils/DimensionsWrapper';

import {
  intersection,
  difference,
  union,
  uniq,
  isEqualWith,
  isEqual
} from 'lodash';

import ZoomContainer from './ZoomContainer';
import BlockCluster from './BlockCluster';

function jaccard(a, b) {
  return a.length !== 0 && b.length !== 0
    ? 1 - intersection(a, b).length / union(a, b).length
    : 1;
}

function somFy(data, width, height) {
  const options = {
    fields: data.length,
    torus: true,
    gridType: 'rect',
    learningRate: 0.1
  };
  // TODO: check later
  const dists = data.map(a => data.map(b => jaccard(a.tags, b.tags)));

  // TODO: verify with different data sets
  const som = new SOM(Math.floor(width / 10), Math.floor(width / 20), options);
  som.setTraining(dists);
  // while (som.trainOne()) {
  //   const somPos = som.predict(dists);
  //   callback(somPos);
  // }

  const somPos = som.predict(dists);
  // TODO: verify memoize
  console.log('somFy, somFy', somFy);
  return somPos;
}

// function mem({ data, width, height, filterSet}) {
//   if (data.length !== this.cache.data.length) {
//     this.cache.result = somFy([...data], width, height);
//     this.cache.data = data;
//     return this.cache.data;
//   }
//
//   const arrayIsEqual = data.every(a => {
//     const oldItem = this.cache.data.find(b => a.id === b.id);
//     if (!oldItem) return false;
//     return (
//       difference(a.tags, oldItem.tags).length === 0 &&
//       difference(oldItem.tags, a.tags).length === 0
//     );
//   });
//
//   if (arrayIsEqual) return this.cache.result;
//
//   this.cache.result = somFy([...data], width, height);
//   this.cache.data = data;
//   return this.cache.result;
// }

function lapFy(data, width, height) {
  const n = data.length;
  const m = Math.ceil(Math.sqrt(n));

  const costs = data.map(d =>
    data.map((_, k) => {
      const i = k % m;
      const j = (k - i) / m;
      const dx = d[0] - i - 0.5;
      const dy = d[1] - j - 0.5;
      return dx * dx + dy * dy;
    })
  );
  const x = d3
    .scaleLinear()
    .domain([0, m - 1])
    .range([0, width]);
  const y = d3
    .scaleLinear()
    .domain([0, m - 1])
    .range([0, height]);

  const la = lap(n, costs);
  const resLa = [...la.col].map((c, k) => {
    const i = k % m;
    const j = (k - i) / m;
    return { i, j };
  });

  return resLa.map(d => [x(d.i), y(d.j)]);
}

class TopicMap extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

 static defaultProps = { filterSet: [], center: 0 };

  constructor(props) {
    super(props);
  }

  layout(data) {
    const {
      mode,
      delay,
      padding,
      force,
      width,
      height,
      filterSet
    } = this.props;
    const pos = this.computeCluster({
      data,
      width: width * 4,
      height: height * 2
    });

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(pos.map(d => d[0])))
      .range([padding.left, width - padding.right]);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(pos.map(d => d[1])))
      .range([padding.top, height - padding.bottom]);

    const nodes = data.map(({ id, x, y, tags, ...c }, i) => {
      const tx = xScale(pos[i][0]);
      const ty = yScale(pos[i][1]);
      return {
        id,
        // ...oldNode,
        x: tx,
        y: ty,
        tx,
        ty,
        tags,
        ...c
      };
    });

    return nodes;
  }

  computeCluster = memoize(
    ({ data, width, height, filterSet }) =>
      somFy(data, width, height, filterSet),
    // lapFy(somFy(data, width, height), width, height),
    (
      { data: dataB, mode: modeB, filterSet: fsB },
      { data: dataA, mode: modeA, filterSet: fsA }
    ) => {
      // return false;
      if (dataA.length !== dataB.length) {
        return false;
      }
      const arrayIsEqual = dataA.every(a => {
        const oldItem = dataB.find(b => a.key === b.key) || false;
        if (!oldItem) return false;
        return (
          difference(a.tags, oldItem.tags).length === 0 &&
          difference(oldItem.tags, a.tags).length === 0
        );
      });
      return arrayIsEqual;
    }
  );

  render() {
    const {
      width,
      height,
      data,
      padding,
      selectedId,
      sets,
      colorScale,
      children,
      filterSet,
      center,
      selectedTags
    } = this.props;

    return (
      <div
        className="h-100 w-100"
        style={{
          paddingTop: 20,
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 40
        }}
      >
        <DimWrapper>
          {(w, h) => (
            <div>
              <BlockCluster
                sets={sets}
                scale={1}
                nodes={data}
                selectedTags={selectedTags}
                width={w}
                height={h}
                colorScale={colorScale}
                filterSet={filterSet}
              >
                {children}
              </BlockCluster>
              {data.map(d => children({ ...d, x: width / 2, y: -100 }))}
            </div>
          )}
        </DimWrapper>
      </div>
    );
  }
}

export default TopicMap;
