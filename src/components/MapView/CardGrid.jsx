import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'react-throttle-render';
import * as d3 from 'd3';
// import VisibilitySensor from 'react-visibility-sensor/visibility-sensor.js';

import { TransitionGroup, Transition } from 'react-transition-group/';
// import { ScrollView, ScrollElement } from '../utils/ScrollView';
import { PreviewCard } from '../cards';
import { setify } from './utils';
import { colorScale } from '../cards/styles';

function createStacks(cards, selectedCardId) {
  const selectedCardIndex = cards.findIndex(d => d.id === selectedCardId);

  const left = cards
    .slice(0, selectedCardIndex)
    .map((c, j) => ({ ...c, position: 'left', i: 0, j }));

  const center = { ...cards[selectedCardIndex], position: 'left', i: 1, j: 0 };
  const right = cards
    .slice(selectedCardIndex + 1, cards.length)
    .map((c, j) => ({ ...c, position: 'right', i: 2, j }));

  return [...left, center, ...right];
  // return [
  //   {
  //     position: 'left',
  //     cards: cards.slice(0, selectedCardIndex)
  //   },
  //   {
  //     position: 'center',
  //     cards: [cards[selectedCardIndex]]
  //   },
  //   {
  //     position: 'right',
  //     cards: cards.slice(selectedCardIndex + 1, cards.length).reverse()
  //   }
  // ];
}

function transitionStyles(i, j, d) {
  const { duration, width, unit } = this.props;
  const { selectedSlot, selectedCardId, cardStacks } = this.state;
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
    transform: selectedCardId === d.id ? 'scale(1.2)' : 'scale(1)'
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

class TagBar extends Component {
  static propTypes = {
    data: PropTypes.array,
    style: PropTypes.object,
    className: PropTypes.string,
    selectedTags: PropTypes.array
  };

  static defaultProps = {
    data: [],
    style: {},
    className: '',
    selectedTags: []
  };

  constructor(props) {
    super(props);
    // this.state = { sets: setify(this.props.data) };
  }

  componentWillReceiveProps(nextProps) {
    // this.setState({
    //   sets: setify(nextProps.data)
    // });
  }

  render() {
    const { selectedTags, tags, style, className } = this.props;
    // const { sets } = this.state;
    const dotOpacity = { entering: 0, entered: 1, exiting: 0, exited: 0 };
    return (
      <TransitionGroup
        className={className}
        style={{
          justifyContent: 'center',
          overflowX: 'scroll',
          overflowY: 'visible',
          width: '100%',
          // height: '100%',
          ...style,
          display: 'grid',
          gridTemplateRows: '50%',
          gridTemplateColumns: 'auto',
          gridAutoFlow: 'column'
          // border: 'solid 5px rosybrown',
        }}
      >
        {tags.map(s => (
          <Transition key={s} timeout={{ enter: 400, exit: 400 }}>
            {state => (
              <div
                className="mr-1 mt-1 p-1"
                style={{
                  borderLeft: 'grey 4px solid',
                  opacity: dotOpacity[state],
                  transition: 'opacity 0.3s',
                  background: colorScale(s),
                  whiteSpace: 'nowrap'
                }}
              >
                {s}
              </div>
            )}
          </Transition>
        ))}
      </TransitionGroup>
    );
  }
}

class CardGrid extends Component {
  static propTypes = {
    cards: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    onExtend: PropTypes.func.isRequired,
    controls: PropTypes.node.isRequired,
    offset: PropTypes.number.isRequired,
    selectedCardId: PropTypes.any,
    style: PropTypes.object,
    className: PropTypes.string,
    visible: PropTypes.bool,
    duration: PropTypes.number,
    width: PropTypes.number,
    innerMargin: PropTypes.number
  };

  static defaultProps = {
    style: {},
    selectedCardId: null,
    setCardOpacity(d) {
      return d;
    },
    visible: true,
    duration: 800,
    width: 100,

    innerMargin: 1,
    unit: 'vw'
  };

  constructor(props) {
    super(props);
    this.id = null;
    this.box = null;
    // TODO: remove later when cards is empty
    const selectedCardId = props.cards[Math.floor(props.cards.length/2)].id;
    const cardStacks = createStacks(props.cards, selectedCardId);
    this.state = {
      selectedCardId,
      selectedSlot: null,
      cardStacks
    };

    // TODO: check later
    this.transitionStyles = transitionStyles.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { cards, selectedCardId } = nextProps;
    const cardStacks = createStacks(cards, selectedCardId);
    console.log('newProps');

    // if (nextProps.cards.length !== cards.length)
    this.setState({
      cardStacks
      // selectedSlot: null
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.selectedCardId !== nextState.selectedCardId ||
      this.props.cards.length !== nextProps.cards.length
    ); // nextProps.selected !== this.props.selected;
    // return true;
  }

  componentDidUpdate(prevProps, prevState) {
    const { onSelect } = this.props;
    const { selectedCardId } = this.state;
    if (
      selectedCardId !== null &&
      prevState.selectedCardId !== selectedCardId
    ) {
      onSelect(selectedCardId);
    }
  }

  // componentWillUpdate(nextProps, nextState) {
  //   const { selectedCardId } = this.state;
  //   if (
  //     selectedCardId !== null &&
  //     nextState.selectedCardId !== selectedCardId
  //   ) {
  //     this._scroller.scrollTo(selectedCardId);
  //   }
  // }

  render() {
    const {
      cards,
      onExtend,
      style,
      className,
      controls,
      // onSelect,
      visible,
      // selectedTags,
      innerMargin,
      duration,
      width
    } = this.props;
    const { selectedCardId, cardStacks } = this.state;
    const selectedCard = cardStacks.find(c => c.id === selectedCardId);
    console.log('selectedCard', selectedCard.tags);
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
                selectedCardId === d.id
                  ? onExtend(d.id)
                  : this.setState({
                      selectedCardId: d.id,
                      selectedSlot: position,
                      cardStacks: createStacks(cardStacks, d.id)
                    })
              }
            >
              <PreviewCard
                {...d}
                key={d.id}
                selected={selectedCardId === d.id}
                style={{
                  // height: '80%',
                  transition: `transform 1s`
                  // boxShadow:
                  //   selectedCardId === d.id &&
                  //   '1px 1px 7px rgba(0,0,0,0.4)'
                }}
              />
            </div>
          ))}
        </div>
        {
          <TagBar
            tags={selectedCard.tags}
            selectedTags={selectedCard}
            className="ml-3 mr-3"
            style={{ marginTop: '4vh' }}
          />
        }
      </div>
    );
  }
}
export default throttle(1000)(CardGrid);
