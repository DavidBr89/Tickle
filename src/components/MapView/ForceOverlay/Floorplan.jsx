import React, { Component } from 'react';
import PropTypes from 'prop-types';

import floorplanImg from './floorplan.png';

class Floorplan extends Component {
  static propTypes = {
    children: PropTypes.node,
    width: PropTypes.number,
    height: PropTypes.number,
    nodes: PropTypes.array
  };

  static defaultProps = {
    children: d => d,
    width: 400,
    height: 400,
    nodes: []
  };

  render() {
    const { width, height, children, nodes } = this.props;
    return (
      <div
        style={{
          backgroundImage: `url(${floorplanImg})`,
          // backgroundRepeat: 'round',
          backgroundSize: 'cover',
          width,
          height
        }}
      >
        {nodes.map(n => {
          const x = n.floorLoc.relX * width;
          const y = n.floorLoc.relY * height;
          console.log('x', x, 'y', y, width, height);
          return children({
            ...n,
            x,
            y
          });
        })}
      </div>
    );
  }
}

export default Floorplan;
