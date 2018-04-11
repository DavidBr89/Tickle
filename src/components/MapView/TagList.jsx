import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import * as d3 from 'd3';
import throttle from 'react-throttle';

import { colorScale, shadowStyle } from '../cards/styles';
import Tag from './Tag';

class TagList extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object,
    data: PropTypes.array,
    scale: PropTypes.func
  };

  static defaultProps = {
    className: '',
    style: {},
    data: [],
    scale: () => 0
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { style, className, data, scale } = this.props;

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
          <Tag
            className="ml-2 mr-2 mb-2"
            innerClassName="p-1"
            barWidth={`${scale(d.count)}%`}
          >
            {d.key}
          </Tag>
        ))}
      </div>
    );
  }
}

export default TagList;
