import React, { Component } from 'react';
import PropTypes from 'prop-types';

const CardImg = ({ width, height }) => (
  <img src={null} alt="icon" width={width} height={height} />
);

CardImg.propTypes = { width: PropTypes.number, height: PropTypes.number };
CardImg.defaultProps = { width: 30, height: 40 };

class ExtendableMarker extends Component {
  static propTypes = {
    delay: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    selected: PropTypes.bool,
    x: PropTypes.number,
    y: PropTypes.number,
    offsetX: PropTypes.number,
    offsetY: PropTypes.number,
    children: PropTypes.node,
    preview: PropTypes.node,
    node: PropTypes.object
  };

  static defaultProps = {
    delay: 0.3,
    preview: <CardImg />,
    node: null,
    offsetX: 0,
    offsetY: 0,
    selected: false,
    x: 0,
    y: 0,
    width: 40,
    height: 50,
    children: <div style={{ background: 'blue' }} />
  };

  // static defaultProps = {
  //   throttle: null
  // };

  constructor(props) {
    super(props);
    this.timeStamp = 0;
  }

  // shouldComponentUpdate(nextProps) {
  //   const { throttle } = nextProps;
  //   const newTimeStamp = new Date().getMilliseconds();
  //   const timediff = Math.abs(newTimeStamp - this.timeStamp);
  //   return (
  //     throttle === null || (throttle !== null && timediff >= throttle)
  //     // nextProps.selected ||
  //     // this.props.selected !== nextProps.selected ||
  //     // !nextProps.throttle
  // //   );
  // // }

  // componentWillUpdate(nextProps, nextState) {
  //   // this.timeStamp = new Date().getMilliseconds();
  // }

  render() {
    const {
      width,
      height,
      selected,
      offsetX,
      offsetY,
      delay,
      x,
      y,
      children,
      onClick,
      preview,
      node
    } = this.props;

    const marker = (
      <div
        onClick={onClick}
        style={{
          position: 'absolute',
          left: selected ? offsetX : x - width / 2 + offsetX,
          top: selected ? offsetY : y - height / 2 + offsetY,
          width: `${width}px`,
          height: `${height}px`,
          transition: `left ${delay}s, top ${delay}s, width ${delay}s, height ${delay}s`,
          pointerEvents: !selected ? 'none' : null
        }}
      >
        <div
          className={selected ? 'selectedCard' : null}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: selected ? 10000 : 0
          }}
        >
          {selected ? children : preview}
        </div>
      </div>
    );
    return marker;
  }
}

export default ExtendableMarker;
