import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PerspectiveMercatorViewport } from 'viewport-mercator-project';
import tsnejs from 'tsne';
import { intersection, union } from 'lodash';

import * as d3 from 'd3';

const jaccard = (a, b) =>
  a.length !== 0 && b.length !== 0
    ? 1 - intersection(a, b).length / union(a, b).length
    : 1;

function runTsne(data, iter = 400) {
  const dists = data.map(a => data.map(b => jaccard(a.tags, b.tags)));

  // eslint-disable-next-line new-cap
  const model = new tsnejs.tSNE({
    dim: 2,
    perplexity: 30
    // epsilon: 10
  });

  // initialize data with pairwise distances
  model.initDataDist(dists);

  for (let i = 0; i < iter; ++i) model.step();

  // Y is an array of 2-D points that you can plot
  return model.getSolution();
}

function forceTsne({ width, height, nodes }) {
  const centerX = d3.scaleLinear().range([0, width]);
  const centerY = d3.scaleLinear().range([0, height]);
  const dists = nodes.map(a => nodes.map(b => jaccard(a.tags, b.tags)));

  // eslint-disable-next-line new-cap
  const model = new tsnejs.tSNE({
    dim: 2,
    perplexity: 50,
    epsilon: 20
  });

  model.initDataDist(dists);
  // every time you call this, solution gets better
  return function(alpha) {
    model.step();
    // console.log('this', this);

    // Y is an array of 2-D points that you can plot
    const pos = model.getSolution();

    centerX.domain(d3.extent(pos.map(d => d[0])));
    centerY.domain(d3.extent(pos.map(d => d[1])));

    nodes.forEach((d, i) => {
      d.x += alpha * (centerX(pos[i][0]) - d.x);
      d.y += alpha * (centerY(pos[i][1]) - d.y);
    });
  };
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
          longitude: PropTypes.number,
          tags: PropTypes.arrayOf(PropTypes.string)
        })
      })
    ),
    delay: PropTypes.number,
    mode: PropTypes.oneOf(['location', 'tsne'])
  };

  static defaultProps = {
    children: d => d,
    className: null,
    style: {},
    viewport: { width: 100, height: 100, longitude: 0, latitude: 0 },
    force: false,
    data: [],
    delay: 200
  };

  constructor(props) {
    super(props);
    const { width, height, data } = props;
    this.state = { nodes: [], tsnePos: runTsne(data, 100), translate: null };
    this.layout = this.layout.bind(this);
    this.forceSim = d3.forceSimulation();
    // this.zoom = this.zoom.bind(this);
  }

  componentDidMount() {
    this.layout();
  }

  componentDidUpdate(prevProps, prevState) {
    const { width, height } = this.props.viewport;
    d3.select(this.zoomCont).call(
      d3
        .zoom()
        // .translateExtent([[0, width], [width, height]])
        .on('zoom', () => {
          console.log('zoom', d3.event);
          // const { x, y } = d3.event.sourceEvent;
          // const translate = `translate(${width / 2 - x * scale}px,${height / 2 -
          //   y * scale}px)scale(${scale})`;
          const { k: scale, x, y } = d3.event.transform;
          const translate = `translate(${x}px,${y}px)scale(${scale})`;

          this.setState({ transform: translate });
        })
    );
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   const { viewport: vp1 } = nextProps;
  //   const { viewport: vp2 } = this.props;
  //   return (
  //     vp1.latitude !== vp2.latitude ||
  //     vp1.longitude !== vp2.longitude ||
  //     vp1.width !== vp2.width ||
  //     vp1.height !== vp2.height ||
  //     vp1.zoom !== vp2.zoom
  //   );
  // }

  componentWillReceiveProps(nextProps) {
    // this.forceSim.on('end', null);
    clearTimeout(this.id);
    this.layout(nextProps);
  }

  // componentDidUpdate(prevProps, prevState) {}

  layout(nextProps = null) {
    const data = (() => {
      if (nextProps !== null) {
        const { nodes } = this.state;
        const { data: newData } = nextProps;
        return newData.map(d => {
          const oldNode = nodes.find(n => n.id === d.id);
          d.x = oldNode && oldNode.x;
          d.y = oldNode && oldNode.y;
          return d;
        });
      }
      return this.props.data;
    })();

    const { viewport, force, mode, delay } = nextProps || this.props;
    const { width, height, zoom, latitude, longitude } = viewport;
    const { tsnePos } = this.state;
    // const tsnePos = runTsne(data, 100);

    // prevent stretching of similiarities
    const padY = height / 7;
    const padX = 30;
    const tsneX = d3
      .scaleLinear()
      .domain(d3.extent(tsnePos.map(d => d[0])))
      .range([padX, width - padX]);

    const tsneY = d3
      .scaleLinear()
      .domain(d3.extent(tsnePos.map(d => d[1])))
      .range([padY, height - padY]);

    const vp = new PerspectiveMercatorViewport({
      width,
      height,
      zoom,
      latitude,
      longitude
    });

    const nodes = data
      .map(({ id, x, y, loc, tags }, i) => {
        const [lx, ly] = vp.project([loc.longitude, loc.latitude]);
        return {
          id,
          lx,
          ly,
          x: x || lx,
          y: y || ly,
          tx: tsneX(tsnePos[i][0]),
          ty: tsneY(tsnePos[i][1]),
          tags
        };
      })
      .filter(n => n.x > 0 && n.x < width && n.y > 0 && n.y < height);

    const isTsne = mode === 'tsne';
    if (force) {
      this.forceSim = this.forceSim
        .nodes(nodes)
        .restart()
        .alpha(1)
        .alphaMin(0.6)
        .force('x', d3.forceX(d => (isTsne ? d.tx : d.lx)).strength(0.8))
        .force('y', d3.forceY(d => (isTsne ? d.ty : d.ly)).strength(0.8))
        // .force(
        //   'tsne',
        //    forceTsne({ width, height, nodes }) : null
        // )
        .force(
          'collide',
          d3.forceCollide(15).strength(1)
          // .iterations(10)
        )
        .on('end', () => {
          this.id = setTimeout(
            () =>
              this.setState({
                nodes: this.forceSim.nodes()
              }),
            delay
          );

          // this.setState({
          //   nodes: this.forceSim.nodes()
          // });
          this.forceSim.on('end', null);
        });
    }

    this.setState({
      nodes
    });
  }

  render() {
    const { children, viewport, style, className, mode } = this.props;
    const { transform } = this.state;
    const { width, height } = viewport;
    const { nodes } = this.state;
    if (mode === 'location') {
      return (
        <div
          className={className}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            // transform
            pointerEvents: 'none',
            ...style
          }}
        >
          {nodes.map(children)}
        </div>
      );
    }

    return (
      <div
        className={className}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          background: 'wheat',
          // transform
          width,
          height,
          // pointerEvents: 'none',
          overflow: 'hidden',
          // zIndex: 2000
          ...style
        }}
      >
        <div
          ref={node => (this.zoomCont = node)}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            transform
            // width,
            // height,
          }}
        >
          {nodes.map(children)}
        </div>
      </div>
    );
  }
}

export default ForceOverlay;
