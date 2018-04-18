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

  const leftScale = d3
    .scaleLinear()
    .domain([0, leftCards.length - 1])
    .range([center - slotSize, 0])
    // .clamp(true);

  const rightScale = d3
    .scaleLinear()
    .domain([0, rightCards.length - 1])
    .range([center, width - slotSize])
    // .clamp(true);

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
    cards: PropTypes.array.isRequired,
    onSelect: PropTypes.func,
    onExtend: PropTypes.func,
    onFilter: PropTypes.func,
    controls: PropTypes.node.isRequired,
    selectedCardId: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
    unit: PropTypes.string,
    visible: PropTypes.bool,
    duration: PropTypes.number,
    width: PropTypes.number,
    innerMargin: PropTypes.number
  };

  static defaultProps = {
    style: {},
    className: '',
    onSelect: d => d,
    onExtend: d => d,
    onFilter: d => d,
    visible: true,
    duration: 800,
    width: 100,
    innerMargin: 1,
    unit: 'vw',
    slotSize: 100 / 3
  };

  constructor(props) {
    super(props);
    const selectedId = props.selectedCardId; // cards[Math.floor(props.cards.length / 2)].id;
    const cardStacks = createStacks(props.cards, selectedId);
    this.state = {
      cardStacks
    };

    // TODO: check later
    // this.transitionStyles = transition.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { cards } = nextProps;
    const cardStacks = createStacks(cards, nextProps.selectedId);
    console.log('newCards', cards);

    // if (nextProps.cards.length !== cards.length)
    this.setState({
      cardStacks
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.selectedId !== nextProps.selectedId ||
      this.props.cards.length !== nextProps.cards.length
    ); // nextProps.selected !== this.props.selected;
    // return true;
  }

  componentDidUpdate(prevProps, prevState) {
    const { onSelect } = this.props;
    const { selectedId } = this.state;
    // if (selectedId !== null && prevState.selectedId !== selectedId) {
    //   onSelect(selectedId);
    // }
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
      cards,
      onExtend,
      controls,
      onSelect,
      visible,
      innerMargin,
      width,
      style,
      className,
      children,
      unit,
      selectedId,
      slotSize
    } = this.props;

    const { cardStacks } = this.state;

    if (cards.length === 0 || !visible) return null;
    const transitionStyles = transition.bind(this)();

    return (
      <div className={className} style={{ ...style, position: 'relative' }}>
        <div
          className="w-100"
          style={{
            display: 'flex',
            justifyContent: 'center',
            position: 'absolute',
            top: -50
            // height: '40%'
          }}
        >
          <div style={{ width: '20%' }}>{controls}</div>
        </div>
        <div
          style={
            {
              // perspective: '2400px',
              // perspectiveOrigin: '50% -50%',
              // height: '100%'
            }
          }
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
