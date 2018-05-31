import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';

import d3Sketchy from '../../lib/d3.sketchy';

class SketchyCircle extends React.Component {
  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    d3Sketchy()
      .circleStroke({
        svg: d3.select(el),
        r: this.props.r,
        density: 1,
        distance: 0,
        sketch: 0.9
      })
      .style('fill', 'none')
      .style('stroke', 'black');
  }

  render() {
    return <g />;
  }
}

SketchyCircle.propTypes = {
  r: PropTypes.number
};

SketchyCircle.defaultProps = {
  r: 12
};
export default SketchyCircle;
