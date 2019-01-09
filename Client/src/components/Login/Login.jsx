import React, { Component } from 'react';
// import * as d3 from 'd3';
import 'mapbox-gl/dist/mapbox-gl.css';

// import { Motion, spring } from 'react-motion';
import PropTypes from 'prop-types';

// TODO: { LinearInterpolator, FlyToInterpolator }
import MapGL from 'react-map-gl';

import StartNav from './StartNav';

class Login extends Component {
  static propTypes = {
    mapZoom: PropTypes.number.isRequired.isRequired,
    centerLocation: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,

    screenResizeAction: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    const { screenResizeAction } = props;

    // screenResizeAction({
    //   width: window.innerWidth,
    //   height: window.innerHeight
    // });
  }

  // componentDidMount() {
  // }
  //
  // componentWillUnmount() {
  // }

  render() {
    const { width, height, centerLocation, mapZoom } = this.props;

    // console.log('width', mapDim);
    const mapViewport = { width, height, ...centerLocation, zoom: mapZoom };
    console.log('mapViewport', mapViewport);
    return (
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0
          }}
        >
          <StartNav />
          <MapGL {...mapViewport} />
        </div>
      </div>
    );
  }
}
export default Login;
