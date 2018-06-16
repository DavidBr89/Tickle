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
        {nodes.map(n =>
          children({
            ...n,
            x: n.floorLoc.relX * width,
            // xFloorScale(n.floorLoc ? n.floorLoc.x : width / 2),
            y: n.floorLoc.relY * height
            // yFloorScale(n.floorLoc ? n.floorLoc.y : height / 2)
          })
        )}
      </div>
    );
  }
}

export default Floorplan;
