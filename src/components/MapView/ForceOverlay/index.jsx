import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import tsnejs from 'tsne';
import lap from 'lap-jv/lap.js';
import * as d3 from 'd3';

import { intersection, union, uniq, flatten } from 'lodash';
import { PerspectiveMercatorViewport } from 'viewport-mercator-project';

import ZoomContainer from './ZoomContainer';
import BubbleOverlay from './BubbleOverlay';

function setify(data) {
  const spreadData = [...data].map(({ id, tags, ...rest }) =>
    tags.map(t => ({ id: t, ref: id, ...rest }))
  );
  return d3
    .nest()
    .key(d => d.id)
    .entries(flatten([...spreadData]))
    .map(d => {
      const count = d.values.length;
      const tags = uniq(flatten(intersection(d.values.map(e => e.tags))));
      return { count, tags, ...d };
    })
    .sort((a, b) => b.count - a.count);
}

const jaccard = (a, b) =>
  a.length !== 0 && b.length !== 0
    ? 1 - intersection(a, b).length / union(a, b).length
    : 1;

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

function calcLapPos(nodes) {
  const m = 5; // Math.ceil(nodes.length / 4);
  const n = m * m;
  const lapData = d3.range(n).map(i => {
    const node = nodes[i];
    // console.log('node.tx', node && node.tx);
    return node ? [node.tx || node.x, node.ty || node.y] : [0, 0];
  });
  // console.log('realLapData', realLapData);

  // const randLapData = d3
  //   .range(n)
  //   .map(k => [m * Math.random(), m * Math.random()]);
  // const w = Math.ceil(width / m);

  const costs = lapData.map(d =>
    d3.range(n).map(k => {
      const i = k % m;
      const j = (k - i) / m;
      const dx = d[0] - i - 0.5;
      const dy = d[1] - j - 0.5;
      return dx * dx + dy * dy;
    })
  );

  const la = lap(n, costs);
  const resLa = [...la.col].map((c, k) => {
    const i = k % m;
    const j = (k - i) / m;
    const cost = costs[c][k];
    return { i, j, cost };
  });
  console.log('resLa', resLa);

  const plotla = resLa.map(d => [50 * d.i, 80 * d.j]);

  // nodes.forEach((d, i) => {
  //   d.tx = plotla[i][0];
  //   d.ty = plotla[i][1];
  // });
  return nodes.map((_, i) => ({ x: plotla[i][0], y: plotla[i][1] }));
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
    padY: PropTypes.number,
    padX: PropTypes.number,
    mode: PropTypes.oneOf(['geo', 'tsne'])
  };

  static defaultProps = {
    children: d => d,
    className: null,
    style: {},
    viewport: { width: 100, height: 100, longitude: 0, latitude: 0 },
    padY: 0,
    padX: 100,
    force: false,
    data: [],
    delay: 300,
    mode: 'geo'
  };

  constructor(props) {
    super(props);
    const { width, height, data } = props;

    this.state = {
      nodes: data.map(d => ({ ...d, x: width / 2, y: height / 2 })),
      tsnePos: data.map(() => [width / 2, height / 2]),
      transEvent: d3.zoomIdentity
    };

    this.layout = this.layout.bind(this);
    this.calcTsne = this.calcTsne.bind(this);

    this.forceSim = d3.forceSimulation();
    // this.zoom = this.zoom.bind(this);
  }

  componentDidMount() {
    this.calcTsne();
    this.layout();
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps', nextProps);
    // this.forceSim.on('end', null);
    clearTimeout(this.id);
    this.layout(nextProps);
    this.calcTsne(nextProps);
  }

  calcTsne(nextProps, iter = 400) {
    const { data, width } = nextProps || this.props;
    const sets = setify(data).reduce((acc, d) => {
      acc[d.key] = d.count;
      return acc;
    }, {});

    const dists = data.map(a =>
      data.map(b =>
        jaccard(
          a.tags.filter(t => sets[t] > 1),
          b.tags.filter(t => sets[t] > 1)
        )
      )
    );
    console.log('dists', dists);

    // eslint-disable-next-line new-cap
    const model = new tsnejs.tSNE({
      dim: 2,
      perplexity: 10, // 10,
      epsilon: 40
    });

    // initialize data with pairwise distances
    model.initDataDist(dists);

    for (let i = 0; i < iter; ++i) {
      model.step();
    }

    const tsnePos = model.getSolution();

    // const n = width / 6;

    this.setState({ tsnePos });
    // Y is an array of 2-D points that you can plot
  }

  layout(nextProps = null) {
    const { viewport, force, mode, delay, data, padY, padX } =
      nextProps || this.props;
    const { width, height, zoom, latitude, longitude } = viewport;
    const { tsnePos } = this.state;
    // const tsnePos = runTsne(data, 300);

    // prevent stretching of similiarities
    // const padY = height / 7;
    const tsneX = d3
      .scaleLinear()
      .domain(d3.extent(tsnePos.map(d => d[0])))
      .range([padX / 2, width - padX / 2]);

    const tsneY = d3
      .scaleLinear()
      .domain(d3.extent(tsnePos.map(d => d[1])))
      // TODO: change height padding
      .range([padY / 2, height - padY / 2]);

    const vp = new PerspectiveMercatorViewport({
      width,
      height,
      zoom,
      latitude,
      longitude
    });

    const nodes = data.map(({ id, x, y, loc, tags, ...c }, i) => {
      const [lx, ly] = vp.project([loc.longitude, loc.latitude]);
      // console.log('id', id, 'x', x, 'y', 'loc', loc, 'tags', tags);
      return {
        id,
        lx,
        ly,
        x: x || lx,
        y: y || ly,
        tx: tsneX(tsnePos[i][0]),
        ty: tsneY(tsnePos[i][1]),
        tags,
        ...c
      };
    });
    // .filter(n => n.x > 0 && n.x < width && n.y > 0 && n.y < height);

    const lapPos = calcLapPos(nodes);
    const getTPos = (d, i) =>
      mode !== 'tsne'
        ? { x: d.tx, y: d.ty }
        : { x: lapPos[i].x, y: lapPos[i].y };

    if (force) {
      this.forceSim = this.forceSim
        .nodes(nodes)
        .restart()
        .alpha(1)
        .alphaMin(0.8)
        .force('x', d3.forceX((d, i) => getTPos(d, i).x).strength(0.6))
        .force('y', d3.forceY((d, i) => getTPos(d, i).y).strength(0.6))
        .force('collide', d3.forceCollide(25).strength(1))
        .on('end', () => {
          this.id = setTimeout(
            () =>
              this.setState({
                nodes: this.forceSim.nodes()
              }),
            delay
          );
          this.forceSim.on('end', null);
        });
    }

    this.setState({
      nodes
    });
  }

  render() {
    console.log('lap', lap);
    const {
      children,
      viewport,
      style,
      className,
      mode,
      selectedCardId,
      center
    } = this.props;

    const { sets } = this.state;
    const { width, height } = viewport;
    const { nodes } = this.state;
    // const newPos = nodes.map(d => transEvent.apply([d.x, d.y]));

    if (mode === 'geo') {
      return (
        <div
          className={className}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            pointerEvents: 'none',
            ...style
          }}
        >
          {nodes.map(children)}
        </div>
      );
    }
    return (
      <ZoomContainer
        width={width}
        height={height}
        nodes={nodes}
        selectedId={null}
        center={center}
      >
        {zoomedNodes => (
          <Fragment>
            <BubbleOverlay
              data={setify(zoomedNodes)}
              width={width}
              height={height}
            />
            <div style={{ overflow: 'hidden', width, height }}>
              {zoomedNodes.map(children)}
            </div>
          </Fragment>
        )}
      </ZoomContainer>
    );
  }
}

export default ForceOverlay;
