import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'react-throttle-render';
import * as d3 from 'd3';
// import VisibilitySensor from 'react-visibility-sensor/visibility-sensor.js';

import { PreviewCard } from '../cards';
import TagBar from './TagBar';

function createStacks(cards, selectedId) {
  const selectedCardIndex = cards.findIndex(d => d.id === selectedId);

  const left = cards.slice(0, selectedCardIndex).map((c, j) => ({
    ...c,
    position: 'left',
    i: 0,
    j: selectedCardIndex - 1 - j
  }));
  // .reverse();

  const center = { ...cards[selectedCardIndex], position: 'left', i: 1, j: 0 };

  const right = cards
    .slice(selectedCardIndex + 1, cards.length)
    .map((c, j) => ({ ...c, position: 'right', i: 2, j }));

  return [...left, center, ...right];
}

function transition() {
  const { duration, width, unit, slotSize } = this.props;
  const { selectedId, cardStacks } = this.state;
  const [leftCards, rightCards] = [
    cardStacks.filter(c => c.position === 'left'),
    cardStacks.filter(c => c.position === 'right')
  ];

  const center = width / 2;

  // TODO: why minus 2 and 1 ???
  const leftScale = j =>
    (leftCards.length - j) * (center - slotSize) / leftCards.length - 2;

  const rightScale = j =>
    center + j * (width - slotSize - center) / rightCards.length + 1;

  // const leftScale = d3
  //   .scalePow()
  //   .domain([0, leftCards.length])
  //   .range([center - slotSize, 0]);
  // // .clamp(true);
  //
  // const rightScale = d3
  //   .scalePow()
  //   .domain([0, rightCards.length])
  //   .range([center, width - slotSize]);
  // // .clamp(true);

  // const transScale = scale.copy().domain([0, domain[1] + 1]);

  return (i, j, d) => {
    const slot = ['left', 'center', 'right'][i];
    // TODO: fix alignment for only <=3 cards
    const zIndex = (() => {
      if (slot === 'left') return leftCards.length - j;
      if (slot === 'right') return rightCards.length - j;
      return 1000;
    })();

    const defaultStyles = {
      zIndex,
      transition: `left ${duration / 1000}s, transform ${duration / 1000}s`,
      transform: selectedId === d.id ? 'scale(1.2)' : 'scale(1)'
    };

    const left = (() => {
      if (slot === 'left') return leftScale(j);
      if (slot === 'right') return rightScale(j);
      return center - slotSize / 2;
    })();

    return {
      left: `${left}${unit}`,
      ...defaultStyles
    };
  };
}

class CardGrid extends Component {
  static propTypes = {
    data: PropTypes.array,
    controls: PropTypes.node.isRequired,
    selectedId: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
    unit: PropTypes.string,
    innerMargin: PropTypes.number,
    centered: PropTypes.bool
  };

  static defaultProps = {
    style: {},
    className: '',
    data: [],
    duration: 800,
    width: 100,
    innerMargin: 1,
    unit: 'vw',
    slotSize: 100 / 3,
    selectedId: 0,
    centered: true
  };

  constructor(props) {
    super(props);
    const selectedId = props.selectedId; // cards[Math.floor(props.cards.length / 2)].id;
    const cardStacks = createStacks(props.data, selectedId);
    this.state = {
      cardStacks
    };

    // TODO: check later
    // this.transitionStyles = transition.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;
    const cardStacks = createStacks(data, nextProps.selectedId);
    this.setState({
      cardStacks
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.selectedId !== nextProps.selectedId ||
      this.props.data.length !== nextProps.data.length
    ); // nextProps.selected !== this.props.selected;
    // return true;
  }

  // componentWillUpdate(nextProps, nextState) {
  //   const { selectedId } = this.state;
  //   if (
  //     selectedId !== null &&
  //     nextState.selectedId !== selectedId
  //   ) {
  //     this._scroller.scrollTo(selectedId);
  //   }
  // }

  render() {
    const {
      data,
      innerMargin,
      style,
      className,
      children,
      unit,
      slotSize,
      width,
      centered
    } = this.props;

    const { cardStacks } = this.state;

    const transitionStyles = transition.bind(this)();

    if (!centered) {
      const scale = i => i * (100 - slotSize) / data.length;
      return (
        <div className={className} style={{ ...style, position: 'relative' }}>
          <div
            style={{
              perspective: '2400px',
              perspectiveOrigin: '50% -50%',
              height: '100%'
            }}
          >
            {data.map((d, i) => (
              <div
                key={d.id}
                className="h-100"
                style={{
                  position: 'absolute',
                  width: `${slotSize - innerMargin}${unit}`,
                  // maxWidth: '200px',
                  paddingLeft: `${innerMargin / 2}${unit}`,
                  paddingRight: `${innerMargin / 2}${unit}`,
                  cursor: 'pointer',
                  left: `${scale(i)}${unit}`
                }}
              >
                {children(d)}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className={className} style={{ ...style, position: 'relative' }}>
        <div
          style={{
            perspective: '2400px',
            perspectiveOrigin: '50% -50%',
            height: '100%'
          }}
        >
          {cardStacks.map(({ i, j, position, ...d }) => (
            <div
              key={d.id}
              className="h-100"
              style={{
                position: 'absolute',
                width: `${slotSize - innerMargin}${unit}`,
                // maxWidth: '200px',
                paddingLeft: `${innerMargin / 2}${unit}`,
                paddingRight: `${innerMargin / 2}${unit}`,
                cursor: 'pointer',
                // maxWidth: '200px',
                ...transitionStyles(i, j, d)
              }}
            >
              {children(d)}
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <div className={className} style={{ ...style, position: 'relative' }}>
        <div
          style={{
            perspective: '2400px',
            perspectiveOrigin: '50% -50%',
            height: '100%'
          }}
        >
          {cardStacks.map(({ i, j, position, ...d }) => (
            <div
              key={d.id}
              className="h-100"
              style={{
                position: 'absolute',
                width: `${slotSize - innerMargin}${unit}`,
                // maxWidth: '200px',
                paddingLeft: `${innerMargin / 2}${unit}`,
                paddingRight: `${innerMargin / 2}${unit}`,
                cursor: 'pointer',
                // maxWidth: '200px',
                ...transitionStyles(i, j, d)
              }}
            >
              {children(d)}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default CardGrid;
