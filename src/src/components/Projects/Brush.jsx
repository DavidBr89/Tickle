import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import cxx from './Brush.scss';

class Brush extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  };

  // constructor(props) {
  //   super(props);
  // }

  componentDidMount() {
    const { width, height } = this.props;

    const x = d3
      .scaleTime()
      .domain([new Date(2013, 7, 1), new Date(2013, 7, 15) - 1])
      .rangeRound([0, width]);

    const svg = d3
      .select(ReactDOM.findDOMNode(this.svg))
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g');
    // .attr('transform', `translate(${margin.left},${margin.top})`);

    svg
      .append('g')
      .attr('class', 'axis axis--grid')
      .attr('transform', `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(d3.timeHour, 12)
          .tickSize(-height)
          .tickFormat(() => null)
      )
      .selectAll('.tick')
      .classed('tick--minor', d => d.getHours());

    svg
      .append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(d3.timeDay)
          .tickPadding(0)
      )
      .attr('text-anchor', null)
      .selectAll('text')
      .attr('x', 6);

    svg
      .append('g')
      .attr('class', 'brush')
      .call(
        d3
          .brushX()
          .extent([[0, 0], [width, height]])
          .on('end', brushended)
      );

    function brushended() {
      if (!d3.event.sourceEvent) return; // Only transition after input.
      if (!d3.event.selection) return; // Ignore empty selections.
      let d0 = d3.event.selection.map(x.invert),
        d1 = d0.map(d3.timeDay.round);

      // If empty when rounded, use floor & ceil instead.
      if (d1[0] >= d1[1]) {
        d1[0] = d3.timeDay.floor(d0[0]);
        d1[1] = d3.timeDay.offset(d1[0]);
      }

      d3
        .select(this)
        .transition()
        .call(d3.event.target.move, d1.map(x));
    }
  }

  render() {
    return (
      <div className={cxx.base}>
        <svg ref={svg => (this.svg = svg)} />
      </div>
    );
  }
}

export default Brush;
