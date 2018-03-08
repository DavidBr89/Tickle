import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
// import { radial } from 'd3-radial';
import { scaleLinear, extent, line } from 'd3';
import * as d3 from 'd3';
import { forceSurface } from 'd3-force-surface';
import d3Radial from 'd3-radial';

console.log('d3ForceSurface', forceSurface);

// import forceExt from 'd3-force-extent';
import {
  // WebMercatorViewport,
  PerspectiveMercatorViewport
} from 'viewport-mercator-project';

import cxs from 'cxs';

import {
  DivOverlay,
  UserOverlay,
  // UserMarker,
  AnimMarker
} from '../utils/map-layers/DivOverlay';

import { Card, CardMarker } from '../cards';

const arrowWrapperStyle = {
  border: 'solid black',
  borderWidth: '0 3px 3px 0',
  display: 'inline-block',
  padding: '3px'
};

const right = {
  transform: 'rotate(-45deg)'
};

const left = {
  transform: 'rotate(135deg)'
};

const up = {
  transform: 'rotate(-135deg)'
};

const down = {
  transform: 'rotate(45deg)'
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
    width: 23,
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
    const { zoom } = mapViewport;
    // const vp = new PerspectiveMercatorViewport(mapViewport);

    // const radialPos = radial()
    //   .center([0, 0])
    //   .size([radius, radius]);
    const rScale = scaleLinear()
      .domain([15, 8])
      .range([window.innerWidth * 2 / 3, 20]);
    const size = rScale(zoom);
    const r = size / 2;
    const rr = 30;
    const radial = d3Radial
      .radial()
      .center([r, r])
      .size([r, r]);

    // const h = 100; // window.innerWidth - size;
    // const w = 100; // window.innerHeight - size;
    // const px = 100;
    // const vh = 100;
    const data = children.map(
      ({ props: { id, loc: { latitude, longitude } } }) => ({
        id,
        longitude,
        latitude
      })
    );

    const positions = radial(data);

    // const normPos = positions.map(([x, y]) => {
    //   const tx = Math.min(Math.max(x, size), w - size);
    //   const ty = Math.min(Math.max(y, r), h - size);
    //   return { tx, ty };
    // });
    //
    // console.log('pos', positions);
    // console.log('normPos', normPos.map(d => [d.tx, d.ty]));
    // const simulation = d3
    //   .forceSimulation([...normPos])
    //   .force('rad', d3.forceRadial(20).strength(1))
    //   // .force('x', d3.forceX((d, i) => normPos[i].tx).strength(0.1))
    //   // .force('y', d3.forceY((d, i) => normPos[i].ty).strength(0.1))
    //   // .force(
    //   //   'cont',
    //   //   forceSurface()
    //   //     .surfaces([
    //   //       { from: { x: 0, y: 0 }, to: { x: 0, y: h } },
    //   //       { from: { x: 0, y: h }, to: { x: w, y: h } },
    //   //       { from: { x: w, y: h }, to: { x: w, y: 0 } },
    //   //       { from: { x: w, y: 0 }, to: { x: 0, y: 0 } }
    //   //     ])
    //   //     .oneWay(true)
    //   //     .elasticity(1)
    //   //     .radius(r)
    //   // )
    //   // .force(
    //   //   'collide',
    //   //   d3.forceCollide(r).strength(1)
    //   //   // .iterations(10)
    //   // )
    //   // .force(
    //   //   'extent',
    //   //   forceExtent()
    //   //     .extent([[0, 0], [width, height]])
    //   //     .bbox(() => [
    //   //       [-width / 2 - pad, -height / 2 - pad],
    //   //       [width / 2 + pad / 2, height / 2 + pad / 2]
    //   //     ])
    //   // )
    //   .stop();
    //
    // for (let i = 0; i < 120; ++i) simulation.tick();
    // radialPos(children.map(({ props: { id } }) => ({ id })));

    // const pad = 3;
    return (
      <div
        style={{
          position: 'relative',
          // top: 0,
          // left: 0,
          border: '1px dashed black',
          zIndex: 5000,
          pointerEvents: 'none',
          // cursor: 'pointer',
          transform: `translate(${-r}px, ${-r}px)`,
          width: `${size}px`,
          height: `${size}px`,
          ...style
        }}
      >
        <svg style={{ width: 2 * r, height: 2 * r }}>
          {positions.map(({ x, y }) => (
            <path d={line()([[x, y], [r, r]])} style={{ stroke: 'grey' }} />
          ))}
        </svg>
        <div>
          {positions.map(({ id, x, y }, i) => (
            <div
              style={{
                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`,
                transition: 'left 0.5s, top 0.5s',
                transform: `translate(${-rr}px, ${-rr}px)`,
                width: `${rr * 2}px`,
                height: `${rr * 2}px`,
                border: '1px black solid',
                background: selected === id ? 'wheat' : 'whitesmoke',
                borderRadius: '50%',
                pointerEvents: 'all',
                cursor: 'pointer'
              }}
            >
            {
              // <i
              // style={{ ...arrowWrapperStyle, ...up, position: 'absolute' }}
              // />
            }
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
      </div>
    );
  }
}

export default ContextView;
