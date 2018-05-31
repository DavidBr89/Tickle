import * as d3 from 'd3-jetpack/build/d3v4+jetpack';
import React from 'react';
// import ReactDOM from 'react-dom';
// import _ from 'lodash';
import PropTypes from 'prop-types';
import d3Radial from 'd3-radial';
import { AnnotationLabel } from 'react-annotation';

import { bboxCollide } from 'd3-bboxCollide';

// import d3sketchy from '../utils/d3.sketchy';

// import swoopyArrow from './utils/swoopyArrow';
// import data from './aboutData';

import { forceExtent } from '../utils/helper';

import cxx from './AboutVis.scss';

function outerRadiusPath(d, pad = 3) {
  // Total difference in x and y from source to target
  const diffX = d.target.x - d.source.x;
  const diffY = d.target.y - d.source.y;

  // Length of path from center of source node to center of target node
  const pathLength = Math.sqrt(diffX * diffX + diffY * diffY);

  // x and y distances from center to outside edge of target node
  const srcOffX = diffX * (d.source.r + pad) / pathLength;
  const srcOffY = diffY * (d.source.r + pad) / pathLength;
  const tgtOffX = diffX * (d.target.r + pad) / pathLength;
  const tgtOffY = diffY * (d.target.r + pad) / pathLength;
  return `M${d.source.x + srcOffX},${d.source.y + srcOffY}L${d.target.x -
    tgtOffX},${d.target.y - tgtOffY}`;
}

const AboutVis = class AboutVis extends React.Component {
  static propTypes() {
    return {
      width: React.PropTypes.number.isRequired,
      height: React.PropTypes.number.isRequired,
      data: React.PropTypes.array.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state = { annoData: [], nodeData: [], links: [] };
  }

  componentDidMount() {
    const { width, height, data } = this.props; // this.props;

    const nodeData = data.map(d => {
      d.width = d.r * 2;
      d.height = d.width;
      d.type = 'node';
      return d;
    });

    const links = [
      { source: nodeData[0], target: nodeData[1] },
      { source: nodeData[1], target: nodeData[2] },
      { source: nodeData[2], target: nodeData[0] }
    ];
    // { source: 2, target: 4 }]);

    const annoData = data.map(d => ({ ...d.annotation })).map((d, i) => ({
      width: 190,
      height: 70,
      type: 'anno',
      data: { x: 0, y: 0 },
      note: {
        label: d.text,
        title: d.name,
        align: 'middle',
        orientation: 'topBottom',
        wrap: 200
      },
      connector: { type: 'elbow' },
      src: data[i],
      subject: {
        radius: nodeData[i].r
        // innerRadius: d.r,
        // outerRadius: d.r
      }
      // className: d.type
    }));

    // const bbox = [
    //   { from: { x: 0, y: 0 }, to: { x: 0, y: height } },
    //   { from: { x: 0, y: height }, to: { x: width, y: height } },
    //   { from: { x: width, y: height }, to: { x: width, y: 0 } },
    //   { from: { x: width, y: 0 }, to: { x: 0, y: 0 } }
    // ];

    const rad = width / 6;
    // const radOffset = width / 6; const centerOffset = 20;
    // d3Radial
    //   .radial()
    //   .center([width / 2, height / 2 + centerOffset])
    //   .size([rad + radOffset, rad + radOffset])(annoData);

    d3Radial
      .radial()
      .center([width / 2, height / 2])
      .size([rad, rad])(nodeData);

    nodeData.forEach(d => {
      d.tx = d.x;
      d.ty = d.y;
    });

    annoData.forEach(d => {
      d.tx = d.src.tx + 0;
      d.ty = d.src.ty + (d.src.name === 'Personal Data' ? 0 : 100);
      d.x = d.tx; // width / 2;
      d.y = d.ty; // height / 2;
    });

    const pad = 10;
    const getBBox = d => [
      [-d.width / 2 - pad, -d.height / 2 - pad],
      [d.width / 2 + pad / 2, d.height / 2 + pad / 2]
    ];

    d3
      .forceSimulation(nodeData.concat(annoData))
      // .alphaMin(0.8)
      .force('collide', bboxCollide(getBBox).strength(0.2))
      .force(
        'extent',
        forceExtent()
          .extent([[-40, 0], [width, height]])
          .bbox(d => [
            [-d.width / 2 - pad, -d.height / 2 - pad],
            [d.width / 2 + pad / 2, d.height / 2 + pad / 2]
          ])
        // .strength(() => 0.7)
      )
      // .force('charge', d3.forceManyBody(d => d.height))
      .force(
        'Y',
        d3.forceY(d => d.ty || 0).strength(d => (d.type === 'node' ? 1 : 0.3))
      )
      .force(
        'X',
        d3.forceX(d => d.tx || 0).strength(d => (d.type === 'node' ? 1 : 0.3))
      )
      // .force('center', d3.forceCenter(width / 2, height / 2))
      .on('tick', () => {
        // Circle.attr('transform', d => `translate(${d.x}, ${d.y})`);
        //
        // makeAnnotations.annotations().forEach((d, i) => {
        //   d.position = nodeData[i];
        // });
        //
        // makeAnnotations.annotations().forEach((d, i) => {
        //   const matchNode = nodeData.find(e => e.id === d.data.src);
        //   const matchAnno = annoData.find(e => e.id === d.id);
        //   d.dx = matchAnno.x - matchNode.x;
        //   d.dy = matchAnno.y - matchNode.y;
        //   d.width = 20;
        //   d.height = 20;
        // });

        // Link.attr('d', outerRadiusPath);

        // makeAnnotations.update();
        //
        this.setState({ annoData, nodeData, links });
      });
    // .alphaMin(0.5)
    // this.setState({ annoData, nodeData });
  }

  // componentDidUpdate() {import { AnnotationXYThreshold, AnnotationCalloutCircle } from "react-annotation"
  //   // document.querySelector('body').classList.toggle(style.active);
  //   // this.componentDidMount.bind(this)();
  // }

  render() {
    const { annoData, nodeData, links } = this.state;
    //
    return (
      <svg width={this.props.width} height={this.props.height}>
        <g>
          {nodeData.map(d => (
            <g transform={`translate(${d.x},${d.y})`}>
              <circle r={d.r} fill="none" stroke="grey" />
              <text className={cxx.label} textAnchor="middle" dy=".20em">
                {d.name}
              </text>
            </g>
          ))}
          <g>
            {links.map(d => (
              <path fill="none" stroke="grey" d={outerRadiusPath(d, 4)} />
            ))}
          </g>
        </g>
        <g>
          {annoData.map((d, i) => (
            <AnnotationLabel {...d} nx={d.x} ny={d.y} x={d.src.x} y={d.src.y} />
          ))}
        </g>
      </svg>
    );
  }
};

AboutVis.propTypes = {
  data: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number
};

AboutVis.defaultProps = {
  // width: 200,
  // height: 200,
  data: [
    {
      name: 'Personal Data',
      tgts: ['VIS', 'sm'],
      r: 30,
      annotation: {
        text:
          'we spent most of our time communicating, discovering and creating stuff on the web and leave traces '
      }
    },
    {
      name: 'Visualization',
      tgts: [],
      r: 50,
      annotation: {
        text:
          'I believe in the power of Visualization as a vehicle to establish pathways and new  learning opportunities'
      }
    },
    {
      name: 'Informal Learning',
      tgts: ['VIS', 'sm'],
      r: 35,
      annotation: {
        text:
          "it's impossible not to learn. Every single second we ponder with people, tools, memories to reflect and genereate ideas and perspectives"
      }
    }
  ]
};

export default AboutVis;

// WEBPACK FOOTER //
// ./src/components/AboutVis.jsx
