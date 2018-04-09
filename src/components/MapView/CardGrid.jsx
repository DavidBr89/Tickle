import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'react-throttle-render';
import * as d3 from 'd3';
// import VisibilitySensor from 'react-visibility-sensor/visibility-sensor.js';

import { PreviewCard } from '../cards';
import TagBar from './TagBar';

function createStacks(cards, selectedId) {
  const selectedCardIndex = cards.findIndex(d => d.id === selectedId);

  const left = cards
    .slice(0, selectedCardIndex)
    .map((c, j) => ({ ...c, position: 'left', i: 0, j }));

  const center = { ...cards[selectedCardIndex], position: 'left', i: 1, j: 0 };

  const right = cards
    .slice(selectedCardIndex + 1, cards.length)
    .map((c, j) => ({ ...c, position: 'right', i: 2, j }));

  return [...left, center, ...right];
}

function transitionStyles(i, j, d) {
  const { duration, width, unit } = this.props;
  const { selectedSlot, selectedId, cardStacks } = this.state;
  const slot = ['left', 'center', 'right'][i];
  const [leftCards, rightCards] = [
    cardStacks.filter(c => c.position === 'left'),
    cardStacks.filter(c => c.position === 'right')
  ];

  const center = width / 2;
  const slotSize = width / 3;

  const leftScale = d3
    .scalePow()
    .exponent(1)
    .domain([0, leftCards.length - 1])
    .range([0, center - slotSize])
    .clamp(true);

  const rightScale = d3
    .scalePow()
    .exponent(1)
    .domain([0, rightCards.length - 1])
    .range([center, width - slotSize])
    .clamp(true);

  // const transScale = scale.copy().domain([0, domain[1] + 1]);

  const zIndex = (() => {
    if (slot === 'left') return j;
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
    unit: 'vw'
  };

  constructor(props) {
    super(props);
    const selectedId = props.selectedCardId; // cards[Math.floor(props.cards.length / 2)].id;
    const cardStacks = createStacks(props.cards, selectedId);
    this.state = {
      selectedId,
      selectedSlot: null,
      cardStacks
    };

    // TODO: check later
    this.transitionStyles = transitionStyles.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { cards } = nextProps;
    const cardStacks = createStacks(cards, this.state.selectedId);
    console.log('newCards', cards);

    // if (nextProps.cards.length !== cards.length)
    this.setState({
      cardStacks
      // selectedSlot: null
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.selectedId !== nextState.selectedId ||
      this.props.cards.length !== nextProps.cards.length
    ); // nextProps.selected !== this.props.selected;
    // return true;
  }

  componentDidUpdate(prevProps, prevState) {
    const { onSelect } = this.props;
    const { selectedId } = this.state;
    if (selectedId !== null && prevState.selectedId !== selectedId) {
      onSelect(selectedId);
    }
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
      onFilter,
      visible,
      innerMargin,
      width,
      style,
      className
    } = this.props;
    const { selectedId, cardStacks } = this.state;
    const slotSize = width / 3;

    if (cards.length === 0 || !visible) return null;

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
          style={{
            perspective: '2400px',
            perspectiveOrigin: '50% -50%',
            height: '90%'
          }}
        >
          {cardStacks.map(({ i, j, position, ...d }) => (
            <div
              key={d.id}
              className="h-100"
              style={{
                position: 'absolute',
                width: `${slotSize - 2 * innerMargin}vw`,
                paddingLeft: `${innerMargin}vw`,
                paddingRight: `${innerMargin}vw`,
                cursor: 'pointer',
                maxWidth: '30vw',
                ...transitionStyles.bind(this)(i, j, d)
              }}
              onClick={() =>
                selectedId === d.id
                  ? onExtend(d.id)
                  : this.setState({
                      selectedId: d.id,
                      selectedSlot: position,
                      cardStacks: createStacks(cardStacks, d.id)
                    })
              }
            >
              <PreviewCard
                {...d}
                key={d.id}
                selected={selectedId === d.id}
                style={{
                  // height: '80%',
                  transition: `transform 1s`
                  // boxShadow:
                  //   selectedId === d.id &&
                  //   '1px 1px 7px rgba(0,0,0,0.4)'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default CardGrid;
