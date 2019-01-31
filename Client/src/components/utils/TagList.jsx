import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Tag from './Tag';

class TagList extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object,
    data: PropTypes.array,
    scale: PropTypes.func,
    colorScale: PropTypes.func
  };

  static defaultProps = {
    className: '',
    style: {},
    data: [],
    barScales: [],
    scale: () => 0,
    colorScale: () => 'green'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { style, className, data, barScales, colorScale } = this.props;

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
            barWidth={`${20}%`}
            color={colorScale(d.key)}
          >
            {d.key}
          </Tag>
        ))}
      </div>
    );
  }
}

export default TagList;
