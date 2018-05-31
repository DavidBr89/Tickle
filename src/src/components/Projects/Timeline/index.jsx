import React, { Component } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import * as chroma from 'chroma-js';
import * as chromatic from 'd3-scale-chromatic';

import { AxisRight } from '@vx/axis';
import { AreaClosed } from '@vx/shape';
// import { LinearGradient } from '@vx/gradient';

import cx from './index.scss';

class Timeline extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    data: PropTypes.array,
    onSelect: PropTypes.func,
    axisPad: PropTypes.number
  };

  static defaultProps = {
    width: 600,
    height: 200,
    data: [{ date: new Date() }],
    color: () => chromatic.schemeYlGnBu[9][0],
    axisPad: 20,
    colorScheme: chromatic.schemeYlGnBu[9],
    onSelect: d => d
  };

  // constructor(props) {
  //   super(props);
  //
  //   // const { data, width } = props;
  //
  //   // this.state = { timeScale };
  // }

  render() {
    const { data, width, height, onSelect } = this.props;
    const dateExt = d3.extent(data, d => d.date);

    const arrowHeight = 40;
    const timeScale = d3
      .scaleTime()
      .domain(dateExt)
      .range([0, height - 40]);

    const timeInterval = d3.timeMonth;

    return (
      <div>
        <div className={cx.timeline}>
          {timeInterval.range(...dateExt).map(startDate => {
            const endDate = timeInterval.offset(startDate);
            return (
              <div
                key={d3.timeFormat('%B %d, %Y')(startDate)}
                className={cx.timeSegment}
                style={{
                  // top: timeScale(startDate),
                  height: timeScale(endDate) - timeScale(startDate),
                  width
                }}
                onClick={() => onSelect(startDate, endDate)}
              />
            );
          })}
        </div>
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: `${width / 2 + 2}px solid transparent`,
            borderRight: `${width / 2 + 2}px solid transparent`,
            borderTop: `${width / 3 + 2}px solid grey`
          }}
        />
      </div>
    );
  }
}

Timeline.defaultProps = { axisPad: 10 };

export default Timeline;
