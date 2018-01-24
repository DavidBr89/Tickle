import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// import ReactTimeout from 'react-timeout';
import WebMercatorViewport from 'viewport-mercator-project';

// console.log('ViewportMercator', ViewportMercator);

// import { FlatMercatorViewport } from 'viewport-mercator-project';

// @ReactTimeout
export default class DivOverlay extends PureComponent {
  static propTypes() {
    return {
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
      zoom: PropTypes.number.isRequired,
      redraw: PropTypes.func.isRequired,
      isDragging: PropTypes.bool.isRequired
    };
  }

  render() {
    const { width, height, isDragging } = this.props;
    // console.log('ViewportMercator', ViewportMercator);
    const style = {
      // pointerEvents: 'none',
      position: 'absolute',
      left: 0,
      top: 0,
      width: `${width}px`,
      height: `${height}px`,
      ...this.props.style
    };
    const mercator = new WebMercatorViewport(this.props);
    const { project, unproject } = mercator;

    return (
      <div style={style}>
        {this.props.redraw({ width, height, project, unproject, isDragging })}
      </div>
    );
  }
}
