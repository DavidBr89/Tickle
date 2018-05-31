import * as d3 from 'd3';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import $ from 'jquery';
import { forceSurface } from 'd3-force-surface';
// import chroma from 'chroma-js';

// import { bboxCollide } from 'd3-bboxCollide';

import cxx from './styles/collage.scss';

import DotDotDot from '../utils/DotDotDot';
// import postcardStyle from '../cxx/postcard.scss';

// import pics from './collagePics';

import { rectCollide, bounds } from '../utils/helper';

const boundingBox = (width, height, padX = 0, padY = 0) => [
  {
    from: { x: padX, y: padY },
    to: { x: padX, y: height - padY }
  },
  {
    from: { x: padX, y: height - padY },
    to: { x: width, y: height - padY }
  },
  {
    from: { x: width, y: height - padY },
    to: { x: width, y: padY }
  },
  {
    from: { x: width, y: padY },
    to: { x: padX, y: padY }
  }
];

class Title extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  };

  // constructor(props) {
  //   super(props);
  //   // this.state = { width: 342, height: 180 };
  // }

  // componentDidMount() {
  //   const el = ReactDOM.findDOMNode(this);
  //   const { width, height } = el.getBoundingClientRect();
  //   // console.log('el.getBoundingClientRect', el.getBoundingClientRect());
  //   // this.setState({ width, height });
  // }

  render() {
    const { children } = this.props;
    // const { width, height } = this.state;
    // console.log(
    //   'getBoundingClientRect',
    //   ReactDOM.findDOMNode(this).getBoundingClientRect()
    // );
    return (
      <div
        className={`${cxx.title} child-borders`}
        style={{
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2
          // background: 'white'
        }}
      >
        {d3.range(0, 9).map((_, i) => (
          <span
            style={{
              transform: `translateZ(${i * 5}px)`,
              position: 'absolute',
              width: '530px',
              height: '120px',
              // opacity: 0.02,
              background: i === 0 ? 'lightgoldenrodyellow' : null,
              opacity: i === 0 ? 0.7 : null
            }}
          >
            <div>
              <svg>
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop
                      offset="0%"
                      style={{ stopColor: '#FF6600', stopOpacity: 1 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: '#FFF000', stopOpacity: 1 }}
                    />
                  </linearGradient>
                </defs>
                {/* TODO */}
                <text
                  transform={`translate(${-100}, ${-10})`}
                  className={cxx.text}
                  fill="url(#grad1)"
                  y="100"
                >
                  {children.title}
                </text>
              </svg>
            </div>
          </span>
        ))}
      </div>
    );
  }
}

function computeLayout(nextProps, callback) {
  const { data, width, height } = nextProps;

  const titleDatum = {
    title: 'Brussels',
    fx: width / 2,
    fy: height / 2,
    width: 666,
    height: 200,
    header: true
  };

  const nodes = data
    .map((d, i) => ({
      ...d,
      width: d.images.low_resolution.width / 3,
      height: d.images.low_resolution.height / 3,
      url: d.images.low_resolution.url,
      vx: width / 2,
      vy:
        i % 2 === 0
          ? d.images.low_resolution.height / 3
          : height - d.images.low_resolution.height / 3 // Math.round(Math.random() * (height - 20))
    }))
    .concat([titleDatum]);
  d3
    .forceSimulation(nodes)
    .force('collide', d3.forceCollide(d => d.height / 2).strength(0.8))
    .force(
      'charge',
      d3.forceManyBody(-10000)
      // .distanceMin(-1000)
      // .theta(0)
    )
    // // .force('bbox', forceContainer([[0, 0], [width, height]]))
    // .force('center', d3.forceCenter(width / 2, height / 2))
    .force('cx', rectCollide(nodes))
    .force(
      'bounds',
      bounds(nodes)
        .width(d => d.width)
        .height(d => d.height)
    )
    .force(
      'container',
      forceSurface()
        .elasticity(0.5)
        .surfaces(boundingBox(width, height))
        // .oneWay(true)
        .radius(d => d.height / 2)
    )
    // .alphaMin(0.6)
    .on('end', () => {
      callback(nodes);
    });
}

class Collage extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    // this.computeLayout = this.computeLayout.bind(this);
    this.state = { nodes: [], data: [] };
  }

  componentDidMount() {
    computeLayout(this.props, nodes => this.setState({ nodes }));
  }
  componentWillReceiveProps(nextProps) {
    computeLayout(nextProps, nodes => this.setState({ nodes }));
  }

  render() {
    const { width, height } = this.props;
    const { nodes } = this.state;

    const stampNodes = nodes.filter(d => !d.header);
    const titleNode = nodes.find(d => d.header) || {};

    console.log('nodes', nodes);
    if (nodes.length === 0)
      return (
        <h1 className="centered" style={{ lineHeight: `${height}px` }}>
          {'Computing Layout'}<DotDotDot />
        </h1>
      );
    // <span className={cxx.border}>&#x24B8; Pour les chomeurs</span>
    return (
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          position: 'relative'
        }}
      >
        <Title key="title">{titleNode}</Title>
        {stampNodes.map(d => (
          <div
            className={cxx.stamp}
            style={{
              left: `${d.x - d.width / 2}px`,
              top: `${d.y - d.height / 2}px`
            }}
          >
            <img src={d.url} alt={d.title} width={d.width} height={d.height} />
          </div>
        ))}
      </div>
    );
  }
}

Collage.defaultProps = {
  width: 550,
  height: 330,
  center: [290, 200]
};

export default Collage;
