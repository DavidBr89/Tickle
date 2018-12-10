import React, { Component } from 'react';
import PropTypes from 'prop-types';
import tsnejs from 'tsne';
import * as d3 from 'd3';
import { intersection, union, uniq, flatten } from 'lodash';
import { PerspectiveMercatorViewport } from 'viewport-mercator-project';
import * as chromatic from 'd3-scale-chromatic';

// import Hull from './Hull';

function setify(data) {
  const spreadData = [...data].map(({ id, tags }) =>
    tags.map(t => ({ id: t, ref: id }))
  );
  return d3
    .nest()
    .key(d => d.id)
    .entries(flatten([...spreadData]))
    .map(d => {
      d.count = d.values.length;
      d.tags = uniq(flatten(intersection(d.values.map(e => e.tags))));
      // d.tags = i % 2 ? ['hallo'] : ['test'];
      return d;
    })
    .sort((a, b) => b.count - a.count);
}

const jaccard = (a, b) =>
  a.length !== 0 && b.length !== 0
    ? 1 - intersection(a, b).length / union(a, b).length
    : 1;

function runTsne(data, iter = 400) {
  const dists = data.map(a => data.map(b => jaccard(a.tags, b.tags)));

  // eslint-disable-next-line new-cap
  const model = new tsnejs.tSNE({
    dim: 2,
    perplexity: 10,
    epsilon: 50
  });

  // initialize data with pairwise distances
  model.initDataDist(dists);

  for (let i = 0; i < iter; ++i) model.step();

  // Y is an array of 2-D points that you can plot
  return model.getSolution();
}

function transform(t) {
  return function(d) {
    const s = t.apply(d);
    console.log('s', s);
    return `translate(${t.apply(d)})`;
  };
}

function forceTsne(nodes) {
  // const centerX = d3.scaleLinear().range([0, width]);
  // const centerY = d3.scaleLinear().range([0, height]);
  const dists = nodes.map(a => nodes.map(b => jaccard(a.tags, b.tags)));

  // eslint-disable-next-line new-cap
  const model = new tsnejs.tSNE({
    dim: 2,
    perplexity: 50,
    epsilon: 20
  });

  model.initDataDist(dists);
  // every time you call this, solution gets better
  return function(alpha, callback) {
    model.step();
    // console.log('this', this);

    return callback(model.getSolution());
    // Y is an array of 2-D points that you can plot
    // const pos = model.getSolution();
    //
    // centerX.domain(d3.extent(pos.map(d => d[0])));
    // centerY.domain(d3.extent(pos.map(d => d[1])));
    //
    // nodes.forEach((d, i) => {
    //   d.x += alpha * (centerX(pos[i][0]) - d.x);
    //   d.y += alpha * (centerY(pos[i][1]) - d.y);
    // });
  };
}

class GeoOverlay extends Component {
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
    delay: 200,
    selected: null
  };

  constructor(props) {
    super(props);
    const { width, height, data } = props;
    const sets = setify(data).filter(d => d.values.length > 2);
    this.state = {
      nodes: [],
      tsnePos: runTsne(data, 400),
      translate: transform(d3.zoomIdentity),
      zoomHandler: d3.zoomIdentity,
      sets
    };
    this.forceSim = d3.forceSimulation();

    this.layout = this.layout.bind(this);
  }

  componentDidMount() {
    const { mode } = this.props;
    this.layout();
    // forceTsne(this.props.data, tsnePos => this.setState({ tsnePos }));
  }

  componentWillReceiveProps(nextProps) {
    const { mode, selected, viewport } = nextProps;
    const { nodes, zoomHandler } = this.state;
    const { width, height } = viewport;
    // this.forceSim.on('end', null);
    clearTimeout(this.id);

    this.layout(nextProps);
  }

  // TODO: simplify, too complicated

  // geoLayout(nextProps = null) {
  //   const { viewport, data } = nextProps || this.props;
  //   const { width, height, zoom, latitude, longitude } = viewport;
  //   const vp = new PerspectiveMercatorViewport({
  //     width,
  //     height,
  //     zoom,
  //     latitude,
  //     longitude
  //   });
  //
  //   const nodes = data
  //     .map(({ id, loc, tags }, i) => {
  //       const [x, y] = vp.project([loc.longitude, loc.latitude]);
  //       return {
  //         id,
  //         lx,
  //         ly,
  //         x: lx,
  //         y: ly,
  //         tags
  //       };
  //     })
  //     .filter(n => n.x > 0 && n.x < width && n.y > 0 && n.y < height);
  //
  //   this.setState({ nodes });
  // }

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
    const { tsnePos, zoomHandler } = this.state;
    // const tsnePos = runTsne(data, 300);

    // prevent stretching of similiarities
    const padY = height / 7;
    const padX = 30;

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
          x: lx,
          y: ly,
          tags
        };
      })
      .filter(n => n.x > 0 && n.x < width && n.y > 0 && n.y < height);

    if (force) {
      this.forceSim = this.forceSim
        .nodes(nodes)
        .restart()
        .alpha(1)
        .alphaMin(0.6)
        .force('x', d3.forceX(d => d.lx).strength(0.8))
        .force('y', d3.forceY(d => d.ly).strength(0.8))
        // .force(
        //   'tsne',
        //    forceTsne({ width, height, nodes }) : null
        // )
        .force(
          'collide',
          d3.forceCollide(10).strength(1)
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
    const { zoomHandler, sets } = this.state;
    const { width, height } = viewport;
    const { nodes } = this.state;
    const bubbleRadius = 50;
    const zoomNodePos = nodes.map(d => zoomHandler.apply([d.x, d.y]));

    const color = d3
      .scaleOrdinal()
      .domain(sets.map(s => s.key))
      .range(chromatic.schemeAccent);
    // .interpolator(chromatic.interpolateYlGnBu)
    // .clamp(true);

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
}

export default GeoOverlay;
