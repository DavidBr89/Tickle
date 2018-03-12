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

function runTsne(inputData, iter = 400) {
  const dists = inputData.map(a => inputData.map(b => jaccard(a.tags, b.tags)));

  const model = new tsnejs.tSNE({
    dim: 2,
    perplexity: 50,
    epsilon: 20
  });

  // initialize data with pairwise distances
  model.initDataDist(dists);

  for (let i = 0; i < iter; ++i) model.step();

  // Y is an array of 2-D points that you can plot
  return model.getSolution();
}

class TopicMap extends Component {
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
        })
      })
    )
  };

  static defaultProps = {
    children: d => d,
    className: null,
    style: {},
    viewport: { width: 100, height: 100, longitude: 0, latitude: 0 },
    force: false,
    data: []
  };

  constructor(props) {
    super(props);
    this.state = { nodes: [] };
    this.layout = this.layout.bind(this);
    this.forceSim = d3.forceSimulation();
  }

  componentDidMount() {
    this.layout();
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

  componentDidUpdate(prevProps, prevState) {}

  layout(nextProps = null) {
    const data = (() => {
      if (nextProps !== null) {
        const { nodes } = this.state;
        const { data: newData } = nextProps;
        return newData.map((d, i) => {
          d.x = nodes[i] && nodes[i].x;
          d.y = nodes[i] && nodes[i].y;
          return d;
        });
      }
      return this.props.data;
    })();

    const { viewport, force } = nextProps || this.props;
    const { width, height, zoom, latitude, longitude } = viewport;
    const vp = new PerspectiveMercatorViewport({
      width,
      height,
      zoom,
      latitude,
      longitude
    });

    const nodes = data
      .map(({ id, x, y, loc }) => {
        const [tx, ty] = vp.project([loc.longitude, loc.latitude]);
        return { id, tx, ty, x: tx, y: ty };
      })
      .filter(n => n.x > 0 && n.x < width && n.y > 0 && n.y < height);

    if (force) {
      this.forceSim = this.forceSim
        .nodes(nodes)
        .restart()
        .alpha(1)
        .alphaMin(0.6)
        .force('x', d3.forceX(d => d.tx).strength(1))
        .force('y', d3.forceY(d => d.ty).strength(1))
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
            200
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
    const { children, viewport, style } = this.props;
    const { width, height } = viewport;
    const { nodes } = this.state;
    return (
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          // width,
          // height
          // zIndex: 2000
          ...style
        }}
      >
        {nodes.map(children)}
      </div>
    );
  }
}

export default TopicMap;
