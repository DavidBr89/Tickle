import _ from 'lodash';
import * as d3 from 'd3-jetpack/build/d3v4+jetpack';
import labella from 'labella';
import { AxisBottom } from '@vx/axis';
import { AnnotationLabel } from 'react-annotation';
// import 'd3-svg-annotation/d3-annotation.css';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import cxx from './index.scss';

// import ReactDOM from 'react-dom';
// import d3Anno from 'd3-svg-annotation';
// import { annotationCalloutCurve } from 'd3-svg-annotation';

// import '../../node_modules/d3-svg-annotation/d3-annotation.css';

// import labella from 'labella';
// import { bboxCollide } from 'd3-bboxCollide';
// import { forceContainer } from 'd3-force-container';
import rawData from './cvData';

// const highlight = (id, focusedId) => {
//   if (!focusedid) return false;
//   if (id === focusedId) return true;
//   return false;
// };

const parseTime = d3.timeParse('%d/%m/%Y');
rawData.forEach(d => {
  d.date = parseTime(d.date);
  d.endDate = parseTime(d.endDate);
});
// import d3sketchy from '../utils/d3.sketchy';

// import styles from './styles/postcard.scss';
// import cvStyl from './styles/cv.scss';

// const formatDate = d3.timeFormat('%d/%m/%Y');

const line = d3
  .line()
  .x(d => d.x)
  .y(d => d.y);

const keys = _.uniq(rawData.map(d => d.type));

const normalOpacity = 0.2;
const fullOpacity = 1;
const lowOpacity = 0.05;

// const delay = 300;
// const peakLength = 1;

function layoutLabels(data, width, bboxes, pad = 12) {
  const nodes = data.map(
    d => new labella.Node(d.tx, bboxes[d.id].width + pad, d.data)
  );

  // TODO: does not work yet
  const minNodeIndex = nodes.reduce(
    (acc, d) => (data.find(e => e.id === acc).tx > d.tx ? d.id : acc),
    data[0].id
  );
  const maxNodeIndex = nodes.reduce(
    (acc, d) => (data.find(e => e.id === acc).tx < d.tx ? d.id : acc),
    data[0].id
  );

  // console.log('minNodeIndex', minNodeIndex, 'maxNodeIndex', maxNodeIndex);

  const force = new labella.Force({
    // TODO: find min
    minPos: bboxes[minNodeIndex].width / 2,
    maxPos: width - bboxes[maxNodeIndex].width / 2,
    algorithm: 'none'
  });

  force.nodes(nodes).compute();
  // renderer.layout(nodes);

  nodes.forEach((n, i) => {
    data[i].x = n.currentPos;
  });
  return data;
}

// function arrowLine(totalWidth, height, arrH) {
//   const width = totalWidth - arrH;
//   const pathData = [
//     [0, 0],
//     [width, 0],
//     [width + arrH, height / 2],
//     [width, height],
//     [0, height],
//     [arrH, height / 2]
//   ];
//   return d3.line()(pathData);
// }

// function arrowLineData(totalWidth, height, arrH) {
//   const width = totalWidth - arrH;
//   return [
//     [0, 0],
//     [width, 0],
//     [width + arrH, height / 2],
//     [width, height],
//     [0, height],
//     [arrH, height / 2]
//   ].map(d => ({ x: d[0], y: d[1] }));
//   // return d3.line()(pathData);
// }

function Dimensions({ data, colorScale, width, focused }) {
  const opacity = d => {
    if (!focused || d.data.includes(focused)) return fullOpacity;
    return lowOpacity;
  };
  const opacityStyle = d => ({
    opacity: opacity(d),
    transition: 'opacity .2s'
  });
  const dims = Object.keys(data)
    .map(key => ({
      type: key,
      y: data[key].y,
      up: data[key].up,
      data: data[key].data
    }))
    .map(d => (
      <g className="dim" transform={`translate(0, ${d.y})`}>
        <text
          dy={d.up ? -7 : 20}
          fill={colorScale(d.type)}
          alignmentBaseline={d.up ? null : 'hanging'}
          style={opacityStyle(d)}
        >
          {d.type}
        </text>
        <line
          x1={0}
          y1={0}
          x2={width}
          y2={0}
          stroke={colorScale(d.type)}
          style={opacityStyle(d)}
        />
      </g>
    ));
  return <g>{dims}</g>;
}

Dimensions.propTypes = {
  data: PropTypes.array.isRequired,
  colorScale: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  focused: PropTypes.string.isRequired
};

class Labella extends Component {
  static propTypes = {
    children: PropTypes.func,
    data: PropTypes.array,
    dimensions: PropTypes.object,
    width: PropTypes.number,
    gap: PropTypes.number,
    mouseHandler: PropTypes.func,
    focused: PropTypes.string
  };
  static defaultProps = {
    children: d => <div>{d}</div>,
    data: [],
    dimensions: {},
    width: 400,
    gap: 30,
    mouseHandler: d => d,
    focused: 'test_id'
  };

  constructor(props) {
    super(props);
    const { data, dimensions, gap, width } = props;

    const inputData = data.map(d => ({
      data: { ...d, x: 0, y: 0 },
      note: {
        label: d.description,
        title: d.title,
        align: 'middle',
        orientation: 'topBottom',
        wrap: 150
      },
      // className: cxx.note,
      // style: { opacity: 0 },
      connector: { type: 'elbow' },
      subject: {
        // radius: 20
        // innerRadius: d.r,
        // outerRadius: d.r
      },
      ...d
    }));

    const bboxes = inputData.reduce((acc, d) => {
      acc[d.id] = { width: d.data.width, height: 90 };
      return acc;
    }, {});

    const personalAnno = inputData.filter(d => d.data.type === 'personal');
    const eduAnno = inputData.filter(d => d.data.type === 'education');
    const geoAnno = inputData.filter(d => d.data.type === 'geography');
    const workAnno = inputData.filter(d => d.data.type === 'work');

    const moveUp = (dimension, pad = 25) => d => {
      d.y = dimension.y0 + gap / 2 + pad;
      return d;
    };

    const moveDown = (dimension, pad = 33) => d => {
      d.y = dimension.y1 - gap / 2 - pad;
      return d;
    };

    const personalNodesDown = layoutLabels(
      personalAnno.slice(-1).map(moveDown(dimensions.personal)),
      width,
      bboxes
    );

    const personalNodesUp = layoutLabels(
      personalAnno.slice(0, -1).map(moveUp(dimensions.personal)),
      width,
      bboxes
    );

    const eduNodesUp = layoutLabels(
      eduAnno.map(moveUp(dimensions.education)),
      width,
      bboxes
    );

    const eduNodesDown = layoutLabels(
      eduAnno.slice(-2).map(moveDown(dimensions.education, -1)),
      width,
      bboxes
    );

    // layoutLabels(
    //   workAnno.slice(-2).map(moveUp(dimensions.work)),
    //   width,
    //   bboxes
    // );

    const workNodesDown = layoutLabels(
      workAnno
        // .slice(0, -2)
        .map(moveDown(dimensions.work))
        .concat(geoAnno.slice(0, 1).map(moveDown(dimensions.work, -30))),
      width,
      bboxes
    );

    const geoNodesDown = layoutLabels(
      geoAnno.map(moveDown(dimensions.geography)),
      width,
      bboxes
    );

    // const personalAnno = inputData.filter(d => d.data.type === 'personal');
    // const eduAnno = inputData.filter(d => d.data.type === 'education');
    // const geoAnno = inputData.filter(d => d.data.type === 'geography');
    // const workAnno = inputData.filter(d => d.data.type === 'work');
    const nodes = [
      ...personalNodesDown,
      ...personalNodesUp,
      ...eduNodesDown,
      ...eduNodesUp,
      ...geoNodesDown,
      ...workNodesDown
    ];

    this.state = { bboxes, nodes };
  }

  // componentDidMount() {
  //   // const { inputData } = this.state;
  //   // const bboxes = data.reduce((acc, d) => {
  //   //   const node = d3
  //   //     .select(ReactDOM.findDOMNode(this.refBoxes[d.id]))
  //   //     .select('.annotation-note-label')
  //   //     .node();
  //   //
  //   //   console.log('node', node);
  //   //   const bbox = node.getBoundingClientRect();
  //   //   acc[d.id] = { width: bbox.width, note: d.note };
  //   //
  //   //   return acc;
  //   // }, {});
  //   // this.setState({ bboxes });
  // }

  refBoxes = {};
  render() {
    const { nodes } = this.state;
    const { mouseHandler, focused } = this.props;

    const enable = id => {
      if (!focused) return cxx.note;
      if (focused === id) return cxx.note;
      return cxx.noteDisabled;
    };

    return (
      <g>
        {nodes.map(d => (
          <g>
            <AnnotationLabel
              {...d}
              className={enable(d.id)}
              nx={d.x}
              ny={d.y}
              x={d.src.x}
              y={d.src.y}
              events={{
                onMouseEnter: () => mouseHandler(d.id),
                onMouseLeave: () => mouseHandler(null)
              }}
            />
          </g>
        ))}
      </g>
    );
  }
}

function TimeSegments({
  data,
  width,
  height,
  colorScale,
  mouseHandler,
  focused
}) {
  const capX = x => (x > width ? width : x);

  const opacityPath = id => {
    if (!focused) return normalOpacity;
    if (id === focused) return fullOpacity;
    return lowOpacity;
  };
  const opacityCircle = id => {
    if (!focused || id === focused) return fullOpacity;
    return lowOpacity;
  };

  return (
    <g>
      {data.map((d, i) => (
        <g>
          <path
            d={d3.line()([
              [d.x, d.y],
              [d.x, height / 2],
              [capX(d.x + d.shapeWidth), height / 2],
              [d.x, d.y]
            ])}
            fill={colorScale(d.type)}
            style={{ opacity: opacityPath(d.id), transition: 'opacity .5s' }}
            stroke={colorScale(d.type)}
            clipPath={`url(#clip${i})`}
          />
          <g transform={`translate(${d.x},${d.y})`}>
            <circle
              onMouseEnter={() => mouseHandler(d.id)}
              onMouseLeave={() => mouseHandler(null)}
              style={{
                opacity: opacityCircle(d.id),
                transition: 'opacity .5s'
              }}
              r={4}
              fill={colorScale(d.type)}
              transform={`translate(${0}, ${0})`}
            />
          </g>
        </g>
      ))}
    </g>
  );
}

TimeSegments.propTypes = {
  data: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number,
  focused: PropTypes.oneOf([null, PropTypes.number]),
  colorScale: PropTypes.func,
  mouseHandler: PropTypes.func
};
TimeSegments.defaultProps = {
  data: [],
  width: 400,
  height: 400,
  focused: null,
  colorScale: () => 'blue',
  mouseHandler: d => d
};

class Timeline extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  };

  static defaultProps = {
    width: 550,
    height: 330,
    data: rawData
  };

  constructor(props) {
    super(props);
    this.initialize = this.initialize.bind(this);
    this.state = this.initialize(props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.initialize(nextProps));
  }

  initialize(props) {
    const { width, height, data } = props || this.props;

    const inputData = data.map((d, i) => {
      d.id = `${i}id`;
      return d;
    });

    const arrowHeight = 14;
    const gap = height / 6;
    const timeScale = d3
      .scaleTime()
      .domain([parseTime('01/01/2002'), d3.max(inputData, d => d.date)])
      .range([0, width])
      .clamp(true)
      .nice();

    const personal = {
      y0: 0,
      y1: height / 2 - gap,
      y: height / 2 - gap * 2,
      up: true,
      data: inputData.filter(d => d.type === 'personal').map(d => d.id)
    };
    const education = {
      y0: height / 2 - gap * 2,
      y: height / 2 - gap,
      y1: height / 2 - gap / 2,
      up: true,
      data: inputData.filter(d => d.type === 'education').map(d => d.id)
    };
    const geography = {
      y0: height / 2 + 2 * gap,
      y: height / 2 + 2 * gap,
      y1: height,
      up: false,
      data: inputData.filter(d => d.type === 'geography').map(d => d.id)
    };
    const work = {
      y0: height / 2,
      y: height / 2 + gap,
      y1: height / 2 + 2 * gap,
      up: false,
      data: inputData.filter(d => d.type === 'work').map(d => d.id)
    };

    const dimensions = { work, education, personal, geography };
    const timePoints = inputData.map(d => _.cloneDeep(d)).map(d => {
      d.startDate = d.date;
      d.endDate = d.endDate;
      d.shapeWidth = timeScale(d.endDate) - timeScale(d.startDate);
      d.shapeHeight = arrowHeight;
      d.x = timeScale(d.startDate);
      d.y = dimensions[d.type].y;
      d.up = dimensions[d.type].up;

      d.timeline = true;
      return d;
    });

    const annoData = inputData.map((d, i) => {
      const src = timePoints.find(e => e.id === d.id);
      return {
        id: `${i}id`,
        tx: src.x,
        ty: src.y,
        src,
        ...d
        // data: { ...d, x: 0, y: 0 }
        // note: {
        //   label: d.description,
        //   title: d.title,
        //   align: 'middle',
        //   orientation: 'topBottom',
        //   wrap: 150
        // },
        // connector: { type: 'elbow' },
        // subject: {
        //   // radius: 20
        //   // innerRadius: d.r,
        //   // outerRadius: d.r
        // }

        // className: d.type
      };
    });

    return { annoData, timeScale, timePoints, dimensions, focused: null };
  }

  // componentDidMount() {
  //   const { annoData } = this.state;
  // }

  refBoxes = {};
  render() {
    const { width, height } = this.props;

    const {
      dimensions,
      timePoints,
      timeScale,
      annoData,
      bboxes,
      focused
    } = this.state;
    // console.log('d', bboxes);

    const gap = height / 6;
    // compute labels dimension

    const colorScale = d3
      .scaleOrdinal()
      .domain(keys)
      .range([
        'rgb(31, 119, 180)',
        'rgb(255, 127, 14)',
        'rgb(44, 160, 44)',
        'rgb(148, 103, 189)'
      ]);

    // const trange = [
    //   d3.timeYear.floor(timeScale.domain()[0]),
    //   d3.timeYear.ceil(timeScale.domain()[1])
    // ];

    // console.log('timePoints', timePoints);

    const timeAxisHeight = 4;
    return (
      <div>
        <svg width={width} height={height}>
          <defs />
          <TimeSegments
            width={width}
            height={height}
            colorScale={colorScale}
            data={timePoints}
            focused={focused}
            mouseHandler={id => this.setState({ focused: id })}
          />
          <Dimensions
            data={dimensions}
            width={width}
            colorScale={colorScale}
            focused={focused}
          />
          <AxisBottom
            scale={timeScale}
            top={height / 2 - timeAxisHeight / 2 + 2}
            stroke={'#1b1a1e'}
            tickTextFill={'#1b1a1e'}
            tickTextFontSize={14}
          />
          <Labella
            mouseHandler={id => this.setState({ focused: id })}
            data={annoData}
            width={width}
            gap={gap}
            focused={focused}
            dimensions={dimensions}
          />
        </svg>
      </div>
    );
  }
}

export default Timeline;
