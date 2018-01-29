import React, { PureComponent, Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'react-throttle-render';

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

class DivOverlay extends PureComponent {
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
      // TODO
      const loc = [c.loc.longitude, c.loc.latitude];
      const pixel = opt.project(loc);
      const [x, y] = [round(pixel[0], 1), round(pixel[1], 1)];

      return children(c, [x, y], opt.unproject);
    });
  }

  render() {
    return <HTMLOverlay {...this.props} redraw={this.redraw} />;
  }
}

DivOverlay.defaultProps = {
  cardClickHandler: d => d,
  children: <div />,
  cards: [],
  itemHeight: 40,
  itemWidth: 30
  // location(c) {return }
};

const SlowDivOverlay = throttle(10)(DivOverlay);

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
      const loc = [c.loc.longitude, c.loc.latitude];
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
    const pixel = opt.project([longitude, latitude]);
    return (
      <i
        style={{
          transform: `translate(${pixel[0]}px, ${pixel[1]}px)`
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
const CardMarker = ({ width, height }) => (
  <img src={cardIconSrc} alt="icon" width={width} height={height} />
);

CardMarker.propTypes = { width: PropTypes.number, height: PropTypes.number };
CardMarker.defaultProps = { width: 30, height: 40 };

const AnimMarker = ({
  key,
  width,
  height,
  selected,
  delay,
  x,
  y,
  children,
  onClick,
  preview
}) => (
  <div
    key={key}
    onClick={onClick}
    style={{
      position: 'absolute',
      left: selected ? `${0}px` : `${x - width / 2}px`,
      top: selected ? `${0}px` : `${y - height / 2}px`,
      width: `${width}px`,
      height: `${height}px`,
      transition: `left ${delay}s, top ${delay}s, width ${delay}s, height ${delay}s, opacity ${delay}s`,
      zIndex: selected ? 5000 : null
    }}
  >
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        className={selected ? 'selectedCard' : null}
        style={{
          position: 'absolute',
          transition: `width ${delay}s, height ${delay}s, opacity ${delay}s`,
          width: '100%',
          height: '100%'
        }}
      >
        {selected ? children : preview}
      </div>
    </div>
  </div>
);

AnimMarker.propTypes = {
  delay: PropTypes.number,
  key: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  preview: PropTypes.node
};

AnimMarker.defaultProps = {
  delay: 0.5,
  preview: <CardMarker />
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
  CardMarker,
  AnimMarker,
  SvgOverlay,
  UserMarker
};
