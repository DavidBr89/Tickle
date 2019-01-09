import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const CardImg = ({ width, height }) => (
  <img src={null} alt="icon" width={width} height={height} />
);

CardImg.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number
};
CardImg.defaultProps = { width: 30, height: 40 };

class ExtendableMarker extends Component {
  static propTypes = {
    delay: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    markerWidth: PropTypes.number,
    markerHeight: PropTypes.number,
    extended: PropTypes.bool,
    x: PropTypes.number,
    y: PropTypes.number,
    children: PropTypes.node,
    preview: PropTypes.node,
    node: PropTypes.object,
    style: PropTypes.object,
    domNode: PropTypes.node.isRequired
  };

  static defaultProps = {
    delay: 200,
    preview: <CardImg />,
    node: null,
    extended: false,
    x: 0,
    y: 0,
    width: 500,
    height: 800,
    markerWidth: 30,
    markerHeight: 50,
    children: <div style={{ background: 'blue' }} />,
    style: {},
    domNode: null
  };

  render() {
    const { x, y, style, preview } = this.props;

    const marker = (
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          transform: 'translate(-50%, -50%)'
        }}
      >
        {preview}
      </div>
    );

    return marker;
  }
}

export default ExtendableMarker;
