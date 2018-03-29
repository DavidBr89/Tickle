import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'react-throttle-render';
// import VisibilitySensor from 'react-visibility-sensor/visibility-sensor.js';

import { TransitionGroup, Transition } from 'react-transition-group/';
// import { ScrollView, ScrollElement } from '../utils/ScrollView';
import { PreviewCard } from '../cards';
import { setify } from './utils';

function createStacks(cards, selectedCardId) {
  const selectedCardIndex = cards.findIndex(d => d.id === selectedCardId);
  return [
    {
      position: 'left',
      cards: cards.slice(0, selectedCardIndex)
    },
    {
      position: 'center',
      cards: [cards[selectedCardIndex]]
    },
    {
      position: 'right',
      cards: cards.slice(selectedCardIndex + 1, cards.length).reverse()
    }
  ];
}

class TagBar extends Component {
  static propTypes = {
    data: PropTypes.array,
    style: PropTypes.object,
    className: PropTypes.string
  };

  static defaultProps = {
    data: [],
    style: {},
    className: ''
  };

  constructor(props) {
    super(props);
    this.state = { sets: setify(this.props.data) };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      sets: setify(nextProps.data)
    });
  }

  render() {
    const { selected, style, className } = this.props;
    const { sets } = this.state;
    const dotOpacity = { entering: 0, entered: 1, exiting: 0, exited: 0 };
    return (
      <TransitionGroup
        className={className}
        style={{
          display: 'flex',
          justifyContent: 'center',
          overflowX: 'scroll',
          overflowY: 'visible',
          ...style
          // border: 'solid 5px rosybrown',
        }}
      >
        {sets.map(c => (
          <Transition key={c.id} timeout={{ enter: 400, exit: 400 }}>
            {state => (
              <div
                className="p-1"
                style={{
                  width: `${100 / sets.length}vw`,
                  margin: '0.4rem',
                  minWidth: '14vw',
                  height: '4vh',
                  // borderRadius: '50%',
                  background: 'white', // selectedCardIndex === i ? 'rosybrown' : 'white',
                  opacity: dotOpacity[state],
                  transition: 'opacity 0.3s',
                  zIndex: 2000,
                  boxShadow: '0.4rem 0.4rem grey',
                  border: '1px solid grey'
                }}
              >
                {c.key}
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
    visible: PropTypes.bool
  };

  static defaultProps = {
    style: {},
    selectedCardId: null,
    setCardOpacity(d) {
      return d;
    },
    visible: true
  };

  constructor(props) {
    super(props);
    this.id = null;
    this.box = null;
    // TODO: remove later when cards is empty
    const selectedCardId = props.cards[0].id;
    this.state = {
      selectedCardId,
      selectedCardStack: null,
      cardStacks: createStacks(props.cards, selectedCardId)
    };

    this.transitionStyles = this.transitionStyles.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { cards, selectedCardId } = nextProps;
    const cardStacks = createStacks(cards, selectedCardId);
    this.setState({ cardStacks });
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

  transitionStyles = (i, j, slotSize) => {
    const { selectedCardStack, cardStacks } = this.state;
    const [leftCards, rightCards] = [cardStacks[0].cards, cardStacks[2].cards];
    const zStep = 10;
    const zIndex =
      selectedCardStack === 'right'
        ? leftCards.length + 1
        : rightCards.length + 1;

    const entered = {
      left: `${i * slotSize}vw`,
      transform: `translateZ(${j * 10}px) scale(1)`
    };

    const exitPos = (() => {
      if (selectedCardStack === 'right') return i - 1;
      if (selectedCardStack === 'left') return i + 1;
      if (i === 0) return -1;
      return 3;
    })();
    return {
      entered,
      entering: { display: 'none' },
      exiting: {
        left: `${slotSize * exitPos}vw`,
        transitionTimingFunction: 'ease-in',
        transform: `translate3d(0,0,${zIndex * zStep}px) scale(1)`,
        zIndex: 2000
      }
    };
  };
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
    const { cards, onExtend, style, controls, onSelect, visible } = this.props;
    const { selectedCardId, cardStacks } = this.state;

    if (cards.length === 0 || !visible) return null;
    const selectedCardIndex = cards.findIndex(d => d.id === selectedCardId);

    const duration = 500;
    const margin = 5;
    const slotSize = 100 / cardStacks.length;

    return (
      <div style={{ ...style, position: 'relative' }}>
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
        <TransitionGroup
          style={{
            perspective: '2400px',
            perspectiveOrigin: '50% -50%',
            height: '90%'
          }}
        >
          {cardStacks.map((s, i) =>
            s.cards.map((d, j) => (
              <Transition
                key={d.id}
                in={false}
                timeout={duration}
                className="h-100"
              >
                {state => (
                  <div
                    className="h-100"
                    style={{
                      position: 'absolute',
                      width: `${slotSize - 2 * margin}vw`,
                      marginLeft: `${margin}vw`,
                      marginRight: `${margin}vw`,
                      cursor: 'pointer',
                      maxWidth: '30vw',
                      transition: `left ${duration /
                        1000}s, transform ${duration / 1000}s`,
                      ...this.transitionStyles(i, j, slotSize)[state]
                    }}
                    onClick={() =>
                      selectedCardId === d.id
                        ? onExtend(d.id)
                        : this.setState({
                            selectedCardId: d.id,
                          selectedCardStack: s.position,
                          cardStacks: createStacks(cards, d.id)
                        })
                    }
                  >
                    <PreviewCard
                      {...d}
                      selected={selectedCardId === d.id}
                      style={{
                        // height: '80%',
                        transform: selectedCardId === d.id && 'scale(1.2)',
                        transition: `transform ${duration / 1000}s`,
                        boxShadow:
                          selectedCardId === d.id && '0.4rem 0.4rem grey'
                      }}
                    />
                  </div>
                )}
              </Transition>
            ))
          )}
        </TransitionGroup>
        <TagBar data={cards} className="m-3" />
      </div>
    );
  }
}
export default throttle(1000)(CardGrid);
