import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'react-throttle-render';
import * as d3 from 'd3';
// import VisibilitySensor from 'react-visibility-sensor/visibility-sensor.js';

import { PreviewCard } from '../cards';
import TagBar from './TagBar';

function createStacks(cards, selectedCardIndex) {
  const left = cards
    .slice(0, selectedCardIndex)
    // TODO
    // .reverse()
    .map((c, j) => ({
      ...c,
      position: 'left',
      i: 0,
      j
      // j
    }));
  // .reverse();

  const center = {
    ...cards[selectedCardIndex],
    position: 'center',
    i: 1,
    j: 0
  };

  const right = cards
    .slice(selectedCardIndex + 1, cards.length)
    .map((c, j) => ({ ...c, position: 'right', i: 2, j }));

  return [...left, center, ...right];
}

function transition() {
  const { duration, width, unit, slotSize } = this.props;
  const { cardStacks } = this.state;
  const [leftCards, rightCards] = [
    cardStacks.filter(c => c.position === 'left'),
    cardStacks.filter(c => c.position === 'right')
  ];

  const center = width / 2;
  const leftOffset = rightCards.length / ( leftCards.length || 1 ) * 100 / center / 2;
  const rightOffset = leftCards.length / ( rightCards.length || 1) * 100 / center / 2;

  console.log('leftOffset', leftOffset, 'rightOffset', rightOffset);

  const leftScale = j =>
    j * (center - slotSize) / leftCards.length + leftOffset;
  //
  const rightScale = j =>
    center + j * (width - slotSize - center) / rightCards.length + rightOffset;

  // const leftScale = d3
  //   .scaleBand()
  //   .domain(d3.range(0, leftCards.length + 1))
  //   .padding(1)
  //   .align(0.5)
  //   .range([0, center - slotSize]);
  // // .clamp(true);
  // //
  // const rightScale = d3
  //   .scaleBand()
  //   .padding(1)
  //   .align(1)
  //   .domain(d3.range(0, rightCards.length + 1))
  //   .range([center + slotSize / 2, width - slotSize]);
  // .clamp(true);

  // const transScale = scale.copy().domain([0, domain[1] + 1]);

  return (i, j, d) => {
    const slot = ['left', 'center', 'right'][i];

    // TODO: fix alignment for only <=3 cards
    const zIndex = (() => {
      if (slot === 'left') j;
      if (slot === 'right') return rightCards.length - j;
      return 1000;
    })();

    const defaultStyles = {
      zIndex,
      transition: `left ${duration / 1000}s, transform ${duration / 1000}s`
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
    style: PropTypes.object,
    className: PropTypes.string,
    unit: PropTypes.string,
    width: PropTypes.number,
    innerMargin: PropTypes.number,
    centered: PropTypes.bool,
    children: PropTypes.func,
    slotSize: PropTypes.number,
    selectedIndex: PropTypes.number
  };

  static defaultProps = {
    style: {},
    className: '',
    data: [],
    duration: 800,
    width: 100,
    innerMargin: 0,
    unit: 'vw',
    slotSize: 100 / 3,
    centered: true,
    children: d => d,
    selectedIndex: 0
  };

  constructor(props) {
    super(props);
    const cardStacks = createStacks(props.data, props.selectedIndex);
    this.state = {
      cardStacks
    };

    // TODO: check later
    // this.transitionStyles = transition.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;

    const cardStacks = createStacks(data, nextProps.selectedIndex);
    console.log('selectedCardIndex', nextProps.selectedIndex);
    this.setState({
      cardStacks
    });
  }

  // TODO: change later
  shouldComponentUpdate(nextProps, nextState) {
    // return (
    //   this.props.data.length !== nextProps.data.length ||
    //   this.props.centered !== nextProps.centered
    // ); // nextProps.selected !== this.props.selected;
    return true;
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
      const scale = d3
        .scaleBand()
        .domain(d3.range(0, data.length))
        .paddingInner(1)
        // .align(0.5)
        .range([0, width - slotSize]);
      // i => i * (100 - slotSize * 3 / 4) / data.length;
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
                  left: `${scale(i)}${unit}`,
                  transition: 'all 1s'
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
