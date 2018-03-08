import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
// import { radial } from 'd3-radial';
import { scaleLinear, extent } from 'd3';
import * as d3 from 'd3';
import { forceSurface } from 'd3-force-surface';
import d3Radial from 'd3-radial';

console.log('d3ForceSurface', forceSurface);

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
    // const vp = new PerspectiveMercatorViewport(mapViewport);

    // const radialPos = radial()
    //   .center([0, 0])
    //   .size([radius, radius]);
    const size = 70;
    const r = size / 2;
    const rr = 10;
    const radial = d3Radial
      .radial()
      .center([r, r])
      .size([r, r]);

    // const h = 100; // window.innerWidth - size;
    // const w = 100; // window.innerHeight - size;
    // const vw = 100;
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
          // border: '1px dashed black',
          zIndex: 5000,
          pointerEvents: 'none',
          // cursor: 'pointer',
          transform: `translate(${-r}vw, ${-r}vw)`,
          width: `${size}px`,
          height: `${size}px`,
          ...style
        }}
      >
        <div>
          {positions.map(({ id, x, y }, i) => (
            <div
              style={{
                position: 'absolute',
                left: `${x}vw`,
                top: `${y}vw`,
                transition: 'left 0.5s, top 0.5s',
                transform: `translate(${-rr}vw, ${-rr}vw)`,
                width: `${rr * 2}vw`,
                height: `${rr * 2}vw`,
                border: '1px black solid',
                background: selected === id ? 'wheat' : 'whitesmoke',
                borderRadius: '50%',
                pointerEvents: 'all',
                cursor: 'pointer'
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
      </div>
    );
  }
}

export default ContextView;
