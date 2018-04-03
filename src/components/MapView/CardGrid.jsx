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
    this.state = { sets: setify(this.props.data) };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      sets: setify(nextProps.data)
    });
  }

  render() {
    const { selectedTags, style, className } = this.props;
    const { sets } = this.state;
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
        {sets.map(s => (
          <Transition key={s.id} timeout={{ enter: 400, exit: 400 }}>
            {state => (
              <div
                className="mr-1 mt-1 p-1"
                style={{
                  borderLeft: 'grey 4px solid',
                  opacity: dotOpacity[state],
                  transition: 'opacity 0.3s',
                  background: selectedTags.includes(s.key)
                    ? colorScale(s.key)
                    : 'white',
                  whiteSpace: 'nowrap'
                }}
              >
                {s.key}
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
    visible: PropTypes.bool,
    duration: PropTypes.number
  };

  static defaultProps = {
    style: {},
    selectedCardId: null,
    setCardOpacity(d) {
      return d;
    },
    visible: true,
    duration: 200
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

  transitionStyles = (i, j, d, slotSize) => {
    const { duration } = this.props;
    const { selectedCardStack, selectedCardId, cardStacks } = this.state;
    const slot = ['left', 'center', 'right'][i];
    const [leftCards, rightCards] = [cardStacks[0].cards, cardStacks[2].cards];
    const scale = d3
      .scalePow()
      .exponent(2)
      .domain([0, slot === 'left' ? leftCards.length : rightCards.length])
      .range([0, 50 - slotSize * 4 / 5]);
    // .clamp(true);

    let entered;
    let exiting;
    const posX = scale(j); // (50 - w) / leftCards.length * scaleLeft(j);
    if (slot === 'left') {
      entered = {
        left: `${i * slotSize + posX}vw`
      };
      exiting = {
        left: `${i * slotSize - posX}vw`
      };
    }
    if (slot === 'right') {
      entered = {
        left: `${i * slotSize - posX}vw`
      };
      exiting = {
        left: `${i * slotSize - posX}vw`
      };
    }

    // if (slot === 'right') {
    //   const multi = -(50 + w) / rightCards.length; // 8 * rightCards.length / leftCards.length;
    //
    //   entered = {
    //     left: `${i * slotSize}vw`,
    //     transform: `translate3d(${j * multi}px,0,${0}vw) scale(1)`
    //   };
    // }
    if (slot === 'center') {
      entered = {
        left: `${slotSize}vw`
      };
    }

    return {
      entered,
      entering: { display: 'none' },
      exiting: {
        ...exiting,
        // transitionTimingFunction: 'ease-in',
        //
        transform: selectedCardId === d.id ? 'scale(1.2)' : 'scale(1)',
        transition: `left ${duration / 1000}s, transform ${duration / 2000}`,
        zIndex: 0
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
    const {
      cards,
      onExtend,
      style,
      controls,
      onSelect,
      visible,
      selectedTags,
      duration
    } = this.props;
    const { selectedCardId, cardStacks } = this.state;

    if (cards.length === 0 || !visible) return null;
    const selectedCardIndex = cards.findIndex(d => d.id === selectedCardId);

    const margin = 1;
    const slotSize = 100 / cardStacks.length;
    const selectedCard = cardStacks[1].cards[0];

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
                      transform:
                        selectedCardId === d.id ? 'scale(1.2)' : 'scale(1)',
                      ...this.transitionStyles(i, j, d, slotSize)[state],
                      zIndex: i === 1 && 1000,
                      transition: `left ${duration /
                        1000}s, transform ${duration / 1000}s`
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
                        transition: `transform 1s`,
                        boxShadow:
                          selectedCardId === d.id &&
                          '1px 1px 7px rgba(0,0,0,0.4)'
                      }}
                    />
                  </div>
                )}
              </Transition>
            ))
          )}
        </TransitionGroup>
        {
          <TagBar
            data={cardStacks[1].cards}
            selectedTags={selectedCard.tags}
            className="ml-3 mr-3"
            style={{ marginTop: '4vh' }}
          />
        }
      </div>
    );
  }
}
export default throttle(1000)(CardGrid);
