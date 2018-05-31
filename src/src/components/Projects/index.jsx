import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import styled from 'styled-components';
// import { LegendOrdinal } from '@vx/legend';
import { scaleOrdinal } from '@vx/scale';

import cx from './index.scss';

// import stampStyle from './stamp.scss';

import Grid from 'mygrid/dist';
// import Brush from './Brush';
import Timeline from './Timeline';

const ft = '%d/%m/%Y';
const parseDate = d3.timeParse(ft);
const formatTime = d3.timeFormat(ft);

const scaleDomain = ['Nothing', 'Project', 'Note', 'Mixtape'];
const colorRange = ['#eeeeee', '#FBE792', '#EDABB3', '#8396BA'];

const calcTimeInterval = data => {
  switch (true) {
    case data.length < 7: {
      return d3.timeDay;
    }
    case data.length <= 31: {
      return d3.timeWeek;
    }
    case data.length < 765: {
      return d3.timeMonth;
    }
    default: {
      return d3.timeYear;
    }
  }
};

const timeFormat = len => {
  switch (true) {
    case len < 7: {
      return '%D';
    }
    case len <= 31: {
      return '%D';
    }
    case len < 765: {
      return '%b';
    }
    default: {
      return '%b';
    }
  }
};

// function getRandomInt(min, max) {
//   return Math.floor(Math.random() * (max - (min + 1))) + min;
// }

// TODO: courtesy of Jon Gold
// const bookPath =
//   'M93,8h-7H7H6C4.9,8,4,7.1,4,6c0-1.1,0.9-2,2-2h74V0H6C2.7,0,0,2.7,0,6v10.5V121c0,3.9,3.1,7,7,7h86c3.9,0,7-3.1,7-7V15C100,11.1,96.9,8,93,8z';

const calcMatrix = (len, step = 7) => {
  // TODO
  const initCols = Math.sqrt(len);
  const initRows = Math.sqrt(len);
  if (Math.floor(initRows) * Math.floor(initCols) >= len) {
    const rows = Math.floor(initRows);
    const cols = Math.floor(initCols / step) * step;
    return { cols, rows };
  } else if (Math.floor(initRows) * Math.ceil(initCols) >= len) {
    const rows = Math.floor(initRows);
    const cols = Math.ceil(initCols / step) * step;
    return { cols, rows };
  } else if (Math.ceil(initRows) * Math.floor(initCols) >= len) {
    console.log('3');
    const rows = Math.ceil(initRows);
    const cols = Math.floor(initCols / step) * step;
    return { cols, rows };
  }
  const rows = Math.ceil(initRows);
  const cols = Math.ceil(initCols / step) * step;
  return { cols, rows };
};

const tileStyle = {
  boxShadow: '3px 3px grey',
  padding: '4px'
};

const colorScale = scaleOrdinal({
  domain: scaleDomain,
  range: colorRange
});

const Legend = () => (
  <div style={{ height: '10%', display: 'flex' }}>
    {colorScale.domain().map(d => (
      <div>
        <h3 style={{ marginRight: '10px' }}>{d}</h3>
        <div
          style={{
            marginRight: '20px',
            width: '25px',
            height: '25px'
          }}
        >
          <div
            className={cx.dayTile}
            style={{
              background: colorScale(d)
            }}
          />
        </div>
      </div>
    ))}
  </div>
);

const ColHeader = ({ cols }) => (
  <div
    style={{
      marginLeft: '5%',
      marginBottom: '10px',
      paddingBottom: '5px'
      // borderBottom: '1px solid black',
      // boxShadow: '3px 3px black'
      // opacity: 0.56
    }}
  >
    <Grid rows={1} cols={cols} span={1} gap={1}>
      {d3.range(0, cols).map((d, i) => (
        <div className={cx.shaky} style={tileStyle}>
          {i % 7 + 1}
        </div>
      ))}
    </Grid>
    <div
      style={{
        width: 0,
        height: 0,
        borderLeft: `${0}px solid transparent`,
        borderRight: `${10 / 3}px solid transparent`,
        borderTop: `${0}px solid grey`
      }}
    />
  </div>
);

const RowHeader = ({ timerange, timeInterval: tval, data, onClick }) => (
  <Grid cols={1} span={1} gap={1}>
    {tval.range(...timerange).map(date => (
      <div className={cx.shaky} style={tileStyle} onClick={onClick}>
        {d3.timeFormat(timeFormat(data))(date)}
      </div>
    ))}
  </Grid>
);

class Projects extends React.Component {
  static propTypes() {
    return {
      center: PropTypes.array.isRequired,
      data: PropTypes.array.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired
    };
  }

  constructor(props) {
    super(props);
    const dateRange = [
      new Date(parseDate('01/01/2017')),
      new Date(parseDate('01/12/2017'))
    ];

    // const days = d3.timeDay.count(dateRange); // 31
    const data = d3.timeDay
      .range(...dateRange)
      .map(date => ({ dummy: true, date, selected: true }));

    this.state = {
      data
    };
  }

  componentDidMount() {
    // const node = d3.select('#front').node();
    // console.log('Front', node);
    // const bbox = node.getBoundingClientRect();
    // const width = bbox.width;
    // const height = bbox.height;
    // this.setState({ width, height });
  }

  render() {
    const { width, height } = this.props;
    const { data } = this.state;
    // const gridHeight = height - 200;
    // const gridWidth = width - 200;
    // const gap = 20;
    // const dummyBookSum = cols * rows - data.length;
    // console.log('days', days);
    // console.log('allData.length', allData.length);

    // console.log('cols', cols);
    const { cols, rows } = calcMatrix(data.length, data.length >= 7 ? 7 : 0);
    const timerange = d3.extent(data, d => d.date);
    const tval = calcTimeInterval(data);
    // const timerange = d3.timeMonth.range(timerange).map(d => <div>Month</div>);

    return (
      <div style={{ width: `${width}px`, height: `${height}px` }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            width: '100%',
            height: '90%'
          }}
        >
          <div style={{ height: '94%', width: '100%' }}>
            <Legend />
            <ColHeader cols={cols} />
            <div style={{ display: 'flex', width: '100%', height: '100%' }}>
              <div
                style={{
                  width: '5%',
                  // borderBottom: '1px solid black',
                  // boxShadow: '3px 0px grey',
                  marginRight: '10px'
                  // opacity: 0.56
                }}
              >
                <div style={{ height: '100%', paddingRight: '10px' }}>
                  <RowHeader
                    timeInterval={tval}
                    timerange={timerange}
                    data={data}
                  />
                </div>
              </div>
              <Grid rows={rows} cols={cols} gap={1.2}>
                {data.map(d => (
                  <Activity
                    {...d}
                    style={{
                      background: colorScale(
                        scaleDomain[Math.floor(Math.random() * 100) % 4]
                      )
                    }}
                  />
                ))}
              </Grid>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const exampleProject = {
  title: 'blalabla project',
  description: "it's about blalabla. and yeah it made fun",
  date: '12/04/2013'
};

const Activity = ({ title, date, description, selected, key, style }) => (
  <div
    key={key}
    className={cx.dayTile}
    style={{ ...style, width: '100%', height: '100%' }}
  >
    <div className={cx.description}>
      <div></div>
    </div>
  </div>
);

Projects.defaultProps = {
  center: [0, 0],
  selected: true,
  type: 'Project',
  data: d3
    .range(0, 5)
    .map(i => ({ ...exampleProject, title: `${exampleProject.title} ${i}` }))
};

export default Projects;
