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
    const {
      width,
      height,
      extended,
      delay,
      x,
      y,
      children,
      onClick,
      preview,
      node,
      style,
      domNode,
      selected
    } = this.props;

    const marker = (
      <div
        onClick={onClick}
        style={{
          // position: extended ? 'fixed' 'absolute',
          position: 'absolute',
          maxWidth: 500,
          // minWidth: 320,
          left: x,
          top: y,
          transform: 'translate(-50%, -50%)',
          // right: extended && 0,
          // bottom: extended && 0,
          width,
          height,
          zIndex: selected && 5000,
          // zIndex: extended && 4000,
          // transition: `transform ${delay}ms, left ${delay}ms, top ${delay}ms, width ${delay}ms, height ${delay}ms`,
          ...style
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: selected && 5000
          }}
        >
          {preview}
        </div>
      </div>
    );

    const teleported = domNode
      ? ReactDOM.createPortal(marker, domNode)
      : marker;
    return teleported;
  }
}

export default ExtendableMarker;
