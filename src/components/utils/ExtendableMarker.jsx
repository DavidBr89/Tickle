import React, { Component } from 'react';
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
    style: PropTypes.object
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
    style: {}
  };

  // static defaultProps = {
  //   throttle: null
  // };

  constructor(props) {
    super(props);
    this.timeStamp = 0;
  }

  shouldComponentUpdate(nextProps) {
    const { x, y, extended } = nextProps;

    return (
      // extended !== this.props.extended ||
      // (this.props.x !== x && this.props.y !== y)
      true
    ); // nextProps.extended ||
    // this.props.extended !== nextProps.extended ||
    // !nextProps.throttle
    // }

    // componentWillUpdate(nextProps, nextState) {
    //   // this.timeStamp = new Date().getMilliseconds();
  }

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
      style
    } = this.props;

    const marker = (
      <div
        onClick={onClick}
        style={{
          position: 'absolute',
          maxWidth: 500,
          left: x,
          top: y,
          transform: 'translate(-50%, -50%)',
          right: extended && 0,
          bottom: extended && 0,
          width: `${width}px`,
          height: `${height}px`,
          zIndex: extended ? 10000 : 0,
          transition: `transform ${delay}ms, left ${delay}ms, top ${delay}ms, width ${delay}ms, height ${delay}ms`,
          ...style
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%'
          }}
        >
          {extended ? children : preview}
        </div>
      </div>
    );
    return marker;
  }
}

export default ExtendableMarker;
