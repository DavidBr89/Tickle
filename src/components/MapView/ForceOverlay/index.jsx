import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

// import tsnejs from 'tsne';
import lap from 'lap-jv/lap.js';
import SOM from 'ml-som';
import scc from 'strongly-connected-components';
// import louvain from './jlouvain';

import { intersection, union, uniq } from 'lodash';
import { PerspectiveMercatorViewport } from 'viewport-mercator-project';

import ZoomContainer from './ZoomContainer';
import BubbleOverlay from './BubbleOverlay';
import TopicAnnotationOverlay from './TopicAnnotationOverlay';
import AmbientOverlay from './AmbientOverlay';

import { setify } from '../utils';

function jaccard(a, b) {
  return a.length !== 0 && b.length !== 0
    ? 1 - intersection(a, b).length / union(a, b).length
    : 1;
}

function somFy(data, width, height, callback = d => d) {
  const options = {
    fields: data.length,
    torus: true,
    gridType: 'rect',
    learningRate: 0.1
  };
  const dists = data.map(a => data.map(b => jaccard(a.tags, b.tags)));

  // TODO: verify with different data sets
  const som = new SOM(Math.floor(width / 10), Math.floor(height / 10), options);
  som.setTraining(dists);
  while (som.trainOne()) {
    const somPos = som.predict(dists);
    callback(somPos);
  }
  const somPos = som.predict(dists);
  return somPos;
}

// function tsneFy(data, callback = d => d, iter = 400) {
//   const sets = setify(data).reduce((acc, d) => {
//     acc[d.key] = d.count;
//     return acc;
//   }, {});
//
//   const dists = data.map(a =>
//     data.map(b =>
//       jaccard(a.tags.filter(t => sets[t] > 1), b.tags.filter(t => sets[t] > 1))
//     )
//   );
//
//   // eslint-disable-next-line new-cap
//   const model = new tsnejs.tSNE({
//     dim: 2,
//     perplexity: 10, // 10,
//     epsilon: 40
//   });
//
//   // initialize data with pairwise distances
//   model.initDataDist(dists);
//
//   for (let i = 0; i < iter; ++i) {
//     model.step();
//     callback(model.getSolution());
//   }
//
//   return model.getSolution();
// }

// function runTsne(data, iter = 400) {
//   const dists = data.map(a => data.map(b => jaccard(a.tags, b.tags)));
//
//   // eslint-disable-next-line new-cap
//   const model = new tsnejs.tSNE({
//     dim: 2,
//     perplexity: 10,
//     epsilon: 50
//   });
//
//   model.initDataDist(dists);
//   for (let i = 0; i < iter; ++i) model.step();
//   return model.getSolution();
// }

// function forceTsne({ width, height, nodes }) {
//   const centerX = d3.scaleLinear().range([0, width]);
//   const centerY = d3.scaleLinear().range([0, height]);
//   const dists = nodes.map(a => nodes.map(b => jaccard(a.tags, b.tags)));
//
//   // eslint-disable-next-line new-cap
//   const model = new tsnejs.tSNE({
//     dim: 2,
//     perplexity: 50,
//     epsilon: 20
//   });
//
//   model.initDataDist(dists);
//   // every time you call this, solution gets better
//   return function(alpha) {
//     model.step();
//     // console.log('this', this);
//
//     // Y is an array of 2-D points that you can plot
//     const pos = model.getSolution();
//
//     centerX.domain(d3.extent(pos.map(d => d[0])));
//     centerY.domain(d3.extent(pos.map(d => d[1])));
//
//     nodes.forEach((d, i) => {
//       d.x += alpha * (centerX(pos[i][0]) - d.x);
//       d.y += alpha * (centerY(pos[i][1]) - d.y);
//     });
//   };
// }

function lapFy(data) {
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
    .range([0, 300]);

  const la = lap(n, costs);
  const resLa = [...la.col].map((c, k) => {
    const i = k % m;
    const j = (k - i) / m;
    return { i, j };
  });

  return resLa.map(d => [x(d.i), x(d.j)]);
}

function splitLinks(nodes, width = Infinity, height = Infinity) {
  const links = [];
  nodes.forEach(s => {
    nodes.forEach(t => {
      const interSet = intersection(s.tags, t.tags);

      // const euclDist = (x1, y1, x2, y2) =>
      //   Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      const distX = Math.abs(t.x - s.x);
      const distY = Math.abs(t.y - s.y);
      // const weight = euclDist(t.x, t.y, s.x, s.y);

      if (
        s.id !== t.id &&
        interSet.length > 0 &&
        distY < height / 7 &&
        distX < width / 3
        // &&
        // s.x > 0 && s.x < width &&
        // t.x > 0 &&
        // t.x < width &&
        // s.y > 0 &&
        // s.y < height &&
        // t.y > 0 &&
        // t.y < height
      ) {
        links.push({
          source: s.id,
          target: t.id,
          interSet
          // weight
        });
      }
    });
  });
  return links;
}

function connectedComponents(nodes, width = Infinity, height = Infinity) {
  // const coms = louvain()
  //   .nodes(nodes.map(d => d.id))
  //   .edges(splitLinks(nodes, width, height))();
  //
  const adjList = nodes.map(n =>
    uniq(
      splitLinks(nodes, width, height)
        .reduce((acc, { source, target }) => {
          if (n.id === source) return [...acc, target];
          if (n.id === target) return [...acc, source];
          return acc;
        }, [])
        .map(id => nodes.findIndex(d => d.id === id))
    )
  );
  const comps = scc(adjList).components;
  return comps.map((d, i) => {
    const values = d.map(e => nodes[e]);
    const tags = d3
      .nest()
      .key(e => e)
      .entries(values.reduce((acc, v) => [...acc, ...v.tags], []))
      .sort((a, b) => b.values.length - a.values.length);

    return {
      key: i,
      values,
      tags
    };
  });

  // const communities = d3
  //   .nest()
  //   .key(d => d.cluster)
  //   .entries(
  //     Object.values(coms).map((cluster, i) => ({
  //       ...nodes[i],
  //       cluster
  //     }))
  //   );
}

class ForceOverlay extends Component {
  static propTypes = {
    children: PropTypes.func,
    className: PropTypes.oneOf([null, PropTypes.string]),
    style: PropTypes.object,
    viewport: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
      longitude: PropTypes.number,
      latitude: PropTypes.number,
      zoom: PropTypes.number
    }),
    data: PropTypes.arrayOf(
      PropTypes.shape({
        loc: PropTypes.shape({
          latitude: PropTypes.number,
          longitude: PropTypes.number
        }),
        tags: PropTypes.arrayOf(PropTypes.string)
      })
    ),
    delay: PropTypes.number,
    padding: PropTypes.shape({
      right: PropTypes.number,
      left: PropTypes.number,
      top: PropTypes.number,
      bottom: PropTypes.number
    }),
    mode: PropTypes.oneOf(['geo', 'tsne', 'som', 'grid']),
    colorScale: PropTypes.func,
    labels: PropTypes.bool
  };

  static defaultProps = {
    children: d => d,
    className: null,
    style: {},
    viewport: { width: 100, height: 100, longitude: 0, latitude: 0 },
    padding: {
      right: 0,
      left: 0,
      bottom: 0,
      top: 0
    },
    force: false,
    data: [],
    delay: 700,
    mode: 'geo',
    colorScale: () => 'green',
    labels: false
  };

  constructor(props) {
    super(props);
    const { data, viewport } = props;
    const { width, height } = viewport;

    const initPos = data.map(() => [width / 2, height / 2]);
    const somPos = somFy(data, width, height);

    const nodes = data.map(d => ({ ...d, x: width / 2, y: height / 2 }));

    this.state = {
      nodes,
      tsnePos: initPos,
      somPos,
      gridPos: lapFy(somPos),
      comps: connectedComponents(nodes)
    };

    this.layout = this.layout.bind(this);
    this.ids = [];

    this.forceSim = d3.forceSimulation();
    // this.zoom = this.zoom.bind(this);
  }

  componentDidMount() {
    this.layout();
  }

  componentWillReceiveProps(nextProps) {
    // clearTimeout(this.id);
    // this.ids.map(clearTimeout);
    const { data: oldData } = this.props;
    const { data: nextData, viewport, mode } = nextProps;
    const { width, height } = viewport;

    if (oldData.length !== nextData.length) {
      const somPos = somFy(nextData, width, height);
      const gridPos = lapFy(somPos);

      this.forceSim.force('x', null).force('y', null);

      this.layout(nextProps, {
        ...this.state,
        somPos,
        gridPos
      });
    } else this.layout(nextProps);
  }

  componentDidUpdate() {
    // clearTimeout(this.id);
    // this.ids.map(clearTimeout);
  }

  componentWillUnmount() {
    // clearTimeout(this.id);
    // this.ids.map(clearTimeout);
  }

  layout(nextProps = null, nextState = null) {
    const { viewport, mode, delay, data, padding, sets } =
      nextProps || this.props;
    const { width, height, zoom, latitude, longitude } = viewport;
    const { tsnePos, somPos, gridPos, nodes: oldNodes, comps } =
      nextState || this.state;

    // console.log('oldNodes', nextState, oldNodes);

    const vp = new PerspectiveMercatorViewport({
      width,
      height,
      zoom,
      latitude,
      longitude
    });

    const geoPos = data.map(({ loc }) =>
      vp.project([loc.longitude, loc.latitude])
    );

    const pos = (() => {
      switch (mode) {
        case 'tsne':
          return tsnePos;
        case 'som':
          return somPos;
        case 'grid':
          return gridPos;
        default:
          return geoPos;
      }
    })();

    const xScale =
      mode !== 'geo'
        ? d3
          .scaleLinear()
          .domain(d3.extent(pos.map(d => d[0])))
          .range([padding.left, width - padding.right])
        : x => x;

    const yScale =
      mode !== 'geo'
        ? d3
          .scaleLinear()
          .domain(d3.extent(pos.map(d => d[1])))
          .range([padding.top, height - padding.bottom])
        : y => y;
    // const tsnePos = runTsne(data, 300);

    // prevent stretching of similiarities
    // const padY = height / 7;

    const nodes = data.map(({ id, x, y, tags, ...c }, i) => {
      const oldNode = oldNodes.find(n => n.id == id) || {};
      return {
        id,
        x: xScale(pos[i][0]),
        y: yScale(pos[i][1]),
        tags,
        ...c
      };
    });

    // .filter(n => n.x > 0 && n.x < width && n.y > 0 && n.y < height);
    this.ids.map(clearTimeout);
    // this.id = setTimeout(() => {
    this.forceSim = this.forceSim
      .nodes(nodes)
      .restart()
      // TODO: proper reheat
      .alpha(1)
      .alphaMin(0.8)
      .force('x', d3.forceX((d, i) => xScale(pos[i][0])).strength(0.5))
      .force('y', d3.forceY((d, i) => yScale(pos[i][1])).strength(0.5))
      .force('coll', d3.forceCollide(15))
      // .force('center', d3.forceCenter(width / 2, height / 2))
      .on('end', () => {
        this.ids.map(clearTimeout);
        this.ids = this.ids.concat([
          setTimeout(
            () =>
              this.setState({
                nodes: this.forceSim.nodes()
              }),
            delay
          )
        ]);
      });
    // }, delay);

    this.forceSim.on('end', null);

    this.ids = [...this.ids, this.id];
    // if (mode === 'geo') this.forceSim.stop();

    this.setState({
      nodes
    });
  }

  render() {
    const {
      children,
      viewport,
      style,
      className,
      mode,
      selectedCardId,
      center,
      sets,
      colorScale,
      labels
    } = this.props;

    const { width, height } = viewport;
    const { nodes, comps } = this.state;
    // const newPos = nodes.map(d => transEvent.apply([d.x, d.y]));
    const tagNode = nodes.find(n => n.id === selectedCardId);
    //TODO: change later
    const selectedTags = selectedCardId ? tagNode && tagNode.tags : [];

    if (mode === 'geo') {
      return (
        <div
          className={className}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            left: 0,
            top: 0,
            pointerEvents: 'none',
            ...style
          }}
        >
          {nodes.map(attr => children({ ...attr, selectedCardId }))}
        </div>
      );
    }
    // TODO: get
    return (
      <ZoomContainer
        width={width}
        height={height}
        center={[width / 2, height * 2 / 3]}
        nodes={nodes}
        selectedId={selectedCardId}
      >
        {(zoomedNodes, transform) => {
          const tmpComps = connectedComponents(zoomedNodes, width, height);
          const setData = [...sets].map(({ values, ...rest }) => {
            const newValues = values.map(n => {
              const { x, y } = zoomedNodes.find(d => n.id === d.id);
              return { ...n, x, y };
            });
            return { values: newValues, ...rest };
          });
          return (
            <Fragment>
              <BubbleOverlay
                comps={comps}
                data={setData}
                selectedTags={selectedTags}
                zoom={transform.k}
                width={width}
                height={height}
                colorScale={colorScale}
              />
              {labels && (
                <TopicAnnotationOverlay
                  comps={tmpComps}
                  data={setData}
                  selectedTags={selectedTags}
                  zoom={transform.k}
                  width={width}
                  height={height}
                  colorScale={colorScale}
                />
              )}
              <div style={{ overflow: 'hidden', width, height }}>
                {zoomedNodes.map(children)}
              </div>
            </Fragment>
          );
        }}
      </ZoomContainer>
    );
  }
}

export default ForceOverlay;
