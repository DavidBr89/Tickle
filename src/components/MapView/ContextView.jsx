import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { radial } from 'd3-radial';
import { scaleLinear, extent } from 'd3';
import * as d3 from 'd3';
// import forceExt from 'd3-force-extent';
import {
  // WebMercatorViewport,
  PerspectiveMercatorViewport
} from 'viewport-mercator-project';

import {
  DivOverlay,
  UserOverlay,
  // UserMarker,
  AnimMarker
} from '../utils/map-layers/DivOverlay';

import { Card, CardMarker } from '../cards';

const forceExtent = function(extent, getBBox) {
  let nodes;

  function force(alpha) {
    let i;
    const n = nodes.length;
    let node;

    for (i = 0; i < n; ++i) {
      node = nodes[i];

      const bbox = getBBox(node);
      const x = node.x;
      const y = node.y;

      const distLeft = x - bbox[0][0] - extent[0][0];
      if (distLeft < 0) {
        node.x = extent[0][0] + bbox[0][0];
      }

      const distBottom = y - bbox[0][1] - extent[0][0];
      if (distBottom < 0) {
        node.y = extent[0][1] + bbox[0][1];
      }

      const distRight = x + bbox[1][0] - extent[1][0];
      if (distRight > 0) {
        node.x = extent[1][0] - bbox[1][0];
      }
      const distTop = y + bbox[1][1] - extent[1][1];
      if (distTop > 0) {
        // node.vy += (extent[1][1] - (y + dist)) * (alpha * pow);
        node.y = extent[1][1] - bbox[1][1];
      }
    }
  }

  force.initialize = function(_) {
    nodes = _;
  };

  force.extent = function(_) {
    return arguments.length ? ((extent = _), force) : extent;
  };
  force.bbox = function(_) {
    return arguments.length ? ((getBBox = _), force) : extent;
  };

  return force;
};

class ContextView extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.node),
    radius: PropTypes.number,
    style: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    node: PropTypes.node
  };

  static defaultProps = {
    radius: 50,
    style: {},
    children: [],
    height: 13,
    width: 20,
    node: document.querySelector('body')
  };

  constructor(props) {
    super(props);
    this.state = { selected: null };
  }

  render() {
    const {
      children,
      radius,
      width,
      height,
      style,
      node,
      mapViewport
    } = this.props;
    const { selected } = this.state;
    const vp = new PerspectiveMercatorViewport(mapViewport);

    const radialPos = radial()
      .center([0, 0])
      .size([radius, radius]);

    const cw = 90;
    const ch = 50;
    const positions = children.map(
      ({ props: { loc: { latitude, longitude } } }) => [longitude, latitude]
    );

    const xS = scaleLinear()
      .domain(extent(positions, ([x, _]) => x))
      .range([0, cw]);

    const yS = scaleLinear()
      .domain(extent(positions, ([_, y]) => y))
      .range([0, ch]);

    const normPos = positions.map(([x, y]) => ({
      x: xS(x),
      y: yS(y)
    }));

    // console.log('pos', positions);
    // console.log('normPos', normPos);
    const pad = 10;
    const simulation = d3
      .forceSimulation([...normPos])
      .force('x', d3.forceX((d, i) => normPos[i].x).strength(1))
      .force('y', d3.forceY((d, i) => normPos[i].y).strength(1))
      // .force('collide', d3.forceCollide(width / 2 + 1))
      // .force(
      //   'extent',
      //   forceExtent()
      //     .extent([[0, 0], [width, height]])
      //     .bbox(() => [
      //       [-width / 2 - pad, -height / 2 - pad],
      //       [width / 2 + pad / 2, height / 2 + pad / 2]
      //     ])
      // )
      .stop();

    for (let i = 0; i < 120; ++i) simulation.tick();
    // radialPos(children.map(({ props: { id } }) => ({ id })));

    // const pad = 3;
    return (
      <div
        style={{
          position: 'relative',
          border: '1px dashed black',
          zIndex: 5000,
          cursor: 'pointer',
          transform: `translate(${-cw / 2}vw, ${-ch / 2}vw)`,
          width: `${cw}vw`,
          height: `${ch}vw`,
          ...style
        }}
      >
        {simulation.nodes().map(({ id, x, y }, i) => (
          <div
            style={{
              position: 'absolute',
              left: `${x}vw`,
              top: `${y}vw`,
              transform: `translate(${-width / 2}vw, ${-height / 2}vw)`,
              width: `${width}vw`,
              height: `${height}vw`,
              border: '1px black solid',
              background: selected === id ? 'wheat' : 'whitesmoke',
              borderRadius: '50%'
            }}
          >
            <div
              className="w-100 h-100"
              onClick={() => this.setState({ selected: id })}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {children[i]}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default ContextView;
