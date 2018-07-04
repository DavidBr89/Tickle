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
  // }

  // componentDidMount() {
  //   // const { width, height, onMapViewportChange } = this.props;
  //   // onMapViewportChange({ width, height });
  // });
  // }

  // this.timeoutId = setTimeout(() => {
  //   this.force = this.force
  //     .nodes(nodes)
  //     .restart()
  //     .alpha(1)
  //     .alphaMin(0.8)
  //     // .force('x', d3.forceX((d, i) => xScale(pos[i][0])).strength(1))
  //     // .force('y', d3.forceY((d, i) => yScale(pos[i][1])).strength(1))
  //     .force('coll', d3.forceCollide(20))
  //     .on('end', () => {
  //       this.setState({
  //         nodes: this.forceSim.nodes(),
  //         timeStamp: new Date().getMilliseconds()
  //       });
  //     });
  // }, 1000);

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
          // position: 'relative'
        }}
      >
        {nodes.map(n => {
          const x = n.floorLoc.relX * width;
          const y = n.floorLoc.relY * height;
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
