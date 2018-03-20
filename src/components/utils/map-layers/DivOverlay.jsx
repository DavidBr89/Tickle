import React, { PureComponent, Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// import throttle from 'react-throttle-render';

// import styles from './CardOverlay.scss';
// const window = require('global/window');
import HTMLOverlay from './div.react';
import SVGOverlay from './svg.react';

// import { HTMLOverlay } from 'react-map-gl';

import cardIconSrc from './cardIcon.svg';

function round(x, n) {
  const tenN = 10 ** n;
  return Math.round(x * tenN) / tenN;
}

// TODO: fix accessor function of DIVOverlay
class DivOverlay extends Component {
  static propTypes = {
    cardClickHandler: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    itemWidth: PropTypes.number,
    itemHeight: PropTypes.number,
    // location: PropTypes.func,
    style: PropTypes.object,
    node: PropTypes.node,
    width: PropTypes.number,
    height: PropTypes.number
  };

  static defaultProps = { style: {}, width: 0, height: 0 };

  constructor(props) {
    super(props);
    this.redraw = this.redraw.bind(this);
  }

  redraw(opt) {
    const { data, children, width, height } = this.props;
    // TODO: unsafe
    let dataArray = data;
    if (!Array.isArray(data)) dataArray = [data];

    return dataArray.map(c => {
      // TODO maybe remove loc attr
      const loc = [c.loc.longitude, c.loc.latitude];
      const pixel = opt.project(loc);
      const [x, y] = [round(pixel[0], 1), round(pixel[1], 1)];

      // TODO: change later, make bounding box checj
      const padding = 20;

      return children(c, [
        Math.min(x, width - padding),
        Math.min(y, height - padding)
      ]);
    });
  }

  render() {
    const { node } = this.props;
    const overlay = <HTMLOverlay {...this.props} redraw={this.redraw} />;
    if (node !== null) return ReactDOM.createPortal(overlay, node);
    return overlay;
  }
}

DivOverlay.defaultProps = {
  cardClickHandler: d => d,
  children: <div />,
  cards: [],
  itemHeight: 40,
  itemWidth: 30,
  node: null
  // location(c) {return }
};

const SlowDivOverlay = DivOverlay;

class SvgOverlay extends React.Component {
  static propTypes = {
    cardClickHandler: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    itemWidth: PropTypes.number,
    itemHeight: PropTypes.number,
    location: PropTypes.func,
    style: PropTypes.object
  };

  static defaultProps = { style: {} };

  constructor(props) {
    super(props);
    this.redraw = this.redraw.bind(this);
  }

  redraw(opt) {
    const { data, children } = this.props;
    return data.map(c => {
      const loc = [c.longitude, c.latitude];
      const pixel = opt.project(loc);
      const [x, y] = [round(pixel[0], 1), round(pixel[1], 1)];
      return children(c, [x, y], opt.unproject);
    });
  }

  render() {
    return <SVGOverlay {...this.props} redraw={this.redraw} />;
  }
}

SvgOverlay.defaultProps = {
  cardClickHandler: d => d,
  children: <div />,
  cards: [],
  itemHeight: 40,
  itemWidth: 30
  // location(c) {return }
};

const UserOverlay = props => {
  function redraw(opt) {
    const { longitude, latitude } = props.location;
    const { w, h } = props;
    const pixel = opt.project([longitude, latitude]);
    return (
      <i
        style={{
          transform: `translate(${pixel[0] - h / 2}px, ${pixel[1] - h / 2}px)`
        }}
        className="fa fa-street-view fa-2x"
        aria-hidden="true"
      />
    );
  }
  return <HTMLOverlay {...props} redraw={redraw} />;
};

UserOverlay.propTypes = {
  location: PropTypes.object.isRequired
};

UserOverlay.propTypes = {
  location: PropTypes.object.isRequired,
  w: PropTypes.number,
  h: PropTypes.number
};

UserOverlay.defaultProps = {
  location: { latitude: 0, longitude: 0 },
  w: 26,
  h: 30
};
// const CardOverlay = ({ cards, onClick, ...mapViewport }) => (
//   <DivOverlay {...mapViewport} data={cards}>
//     <img
//       src={cardIconSrc}
//       alt="icon"
//       width={width}
//       height={height}
//       onClick={onClick}
//     />
//   </DivOverlay>
// );

// CardOverlay.propTypes = {
//   mapViewport: PropTypes.object.isRequired,
//   cards: PropTypes.array.isRequired
// };

// TODO: rename
const CardImg = ({ width, height }) => (
  <img src={cardIconSrc} alt="icon" width={width} height={height} />
);

CardImg.propTypes = { width: PropTypes.number, height: PropTypes.number };
CardImg.defaultProps = { width: 30, height: 40 };

class AnimMarker extends Component {
  static propTypes = {
    // children: PropTypes.node,
    // className: PropTypes.string,
    // throttle: PropTypes.oneOf([null, PropTypes.number]),
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    offsetX: PropTypes.number,
    offsetY: PropTypes.number,
    children: PropTypes.node.isRequired,
    preview: PropTypes.node,
    node: PropTypes.object
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
            zIndex: selected ? 2000 : 0
          }}
        >
          {selected ? children : preview}
        </div>
      </div>
    );
    return marker;
  }
}

// const AnimMarker = ({
//   width,
//   height,
//   selected,
//   offsetx,
//   offsety,
//   delay,
//   x,
//   y,
//   children,
//   onclick,
//   preview,
//   node
// }) => {
//   const marker = (
//     <div
//       onClick={onClick}
//       style={{
//         position: 'absolute',
//         left: selected ? `${offsetX}px` : `${x - width / 2}px`,
//         top: selected ? `${offsetY}px` : `${y - height / 2}px`,
//         width: `${width}px`,
//         height: `${height}px`,
//         transition: `left ${delay}s, top ${delay}s, width ${delay}s, height ${delay}s`
//       }}
//     >
//         <div
//           className={selected ? 'selectedCard' : null}
//           style={{
//             position: 'absolute',
//             width: '100%',
//             height: '100%',
//             zIndex: selected ? 2000 : 0
//           }}
//         >
//           {selected ? children : preview}
//         </div>
//       </div>
//   );
//   if (node !== null) return ReactDOM.createPortal(marker, node);
//   return marker;
// };

AnimMarker.propTypes = {
  delay: PropTypes.number,
  width: PropTypes.string,
  height: PropTypes.string,
  selected: PropTypes.bool,
  x: PropTypes.number,
  y: PropTypes.number,
  offsetX: PropTypes.number,
  offsetY: PropTypes.number,
  children: PropTypes.node,
  preview: PropTypes.node,
  node: PropTypes.object
};

AnimMarker.defaultProps = {
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

const UserMarker = ({ x, y }) => (
  <i
    style={{
      transform: `translate(${x}px, ${y}px)`
    }}
    className="fa fa-street-view fa-2x"
    aria-hidden="true"
  />
);

export {
  SlowDivOverlay,
  DivOverlay,
  UserOverlay,
  // CardOverlay,
  CardImg,
  AnimMarker,
  SvgOverlay,
  UserMarker
};
