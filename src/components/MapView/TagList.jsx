import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import { colorScale, shadowStyle } from '../cards/styles';

class TagList extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object,
    data: PropTypes.array
  };

  static defaultProps = {
    className: '',
    style: {},
    data: []
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { style, className, data } = this.props;
    if (data.length === 0) return null;
    const max = d3.max(data, d => d.count);
    const min = d3.min(data, d => d.count);
    const scale = d3
      .scaleLinear()
      .domain([min, max])
      .range([10, 100]);

    return (
      <div
        className={className}
        style={{
          ...style,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}
      >
        {data.map(d => (
          <div
            className="m-2"
            style={{
              borderRadius: '10%',
              zIndex: 2000,
              minWidth: '20vw',
              background: 'white',
              position: 'relative',
              boxShadow: '0.4rem 0.4rem grey',
              border: 'black 2px solid'
            }}
          >
            <div
              style={{
                position: 'absolute',
                background: colorScale(d.key),
                width: `${scale(d.count)}%`,
                height: '100%',
                zIndex: -1
              }}
            />

            <div className="p-2" style={{ zIndex: 2000 }}>
              {d.key}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default TagList;
