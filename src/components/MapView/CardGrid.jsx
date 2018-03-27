import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'react-throttle-render';
// import VisibilitySensor from 'react-visibility-sensor/visibility-sensor.js';

import { TransitionGroup, Transition } from 'react-transition-group/';
// import { ScrollView, ScrollElement } from '../utils/ScrollView';
import { PreviewCard } from '../cards';

function createCardSets(cards, selectedCardId) {
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
      reset: false,
      cardSets: createCardSets(props.cards, selectedCardId)
    };
  }

  componentWillReceiveProps(nextProps) {
    const { cards, selectedCardId } = nextProps;
    const cardSets = createCardSets(cards, selectedCardId);
    this.setState({ cardSets });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.selectedCardId !== nextState.selectedCardId ||
      this.props.cards.length !== nextProps.cards.length
    ); // nextProps.selected !== this.props.selected;
    // return false;
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
    const { cards, onExtend, style, controls, onSelect, visible } = this.props;
    const { selectedCardId, cardSets } = this.state;
    if (cards.length === 0 || !visible) return null;

    const selectedCardIndex = cards.findIndex(d => d.id === selectedCardId);
    // const onChange = d => visible => {
    //   // clearTimeout(this.id);
    //   if (visible) {
    //     clearTimeout(this.id);
    //     this.id = setTimeout(() => {
    //       // TODO: big hack make issue in react visibility-sensor
    //       this.setState({ selectedCardId: d.id, lastScroll: new Date() });
    //       onSelect(d.id);
    //     }, 750);
    //   }
    // };

    const duration = 300;
    const margin = 4;
    const slotSize = 100 / cardSets.length;

    const transitionStyles = ({ position, cards }, i, j) =>
      // const transitionTimingFunction = state === 'entering' ? 'ease-in' : 'ease-out';
      ({
        entering: {
          left: `${slotSize * (i + 1)}vw`,
          transitiontimingfunction: 'ease-in'
          // transform: `translate3d(0,0,${j * 10}px) scale(1)`
          // zIndex: 200 * j
        },
        entered: {
          left: `${i * slotSize}vw`,
          // transform: position === 'center' ? 'scale(1.2)' : 'scale(1)',
          transform: `translate3d(0,0,${j * 10}px) scale(1)`
          // zIndex: 10 * j
        },
        exiting: {
          left: `${slotSize * (i - 1)}vw`,
          // transform: 'scale(1)',
          transitionTimingFunction: 'ease-out',
          transform: `translate3d(0,0,${j * 10}px) scale(1)`
        }
        // exited: { left, transitionTimingFunction: 'ease-out' }
      });

    // console.log('cardSets', cardSets);

    const dotOpacity = { entering: 0, entered: 1, exiting: 0, exited: 0 };
    return (
      <div style={style}>
        <TransitionGroup
          className="h-100"
          style={{
            perspective: '1400px',
            perspectiveOrigin: '50% -50%'
          }}
        >
          {cardSets.map((s, i) =>
            s.cards.map((d, j) => (
              <Transition
                key={d.id}
                timeout={{ enter: duration, exit: duration  * 2}}
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
                      ...transitionStyles(s, i, j)[state],
                      transition: `left ${duration /
                        1000}s, transform ${duration / 1000}s`,
                      maxWidth: '30vw'
                    }}
                  >
                    <div style={{ opacity: selectedCardId === d.id ? 1 : 0 }}>
                      {controls}
                    </div>
                    <PreviewCard
                      {...d}
                      onClick={() =>
                        selectedCardId === d.id
                          ? onExtend(d.id)
                          : this.setState({
                            selectedCardId: d.id,
                            cardSets: createCardSets(cards, d.id)
                          })
                      }
                      selected={selectedCardId === d.id}
                      style={{
                        boxShadow:
                          selectedCardId === d.id ? '0.4rem 0.4rem grey' : null
                      }}
                    />
                  </div>
                )}
              </Transition>
            ))
          )}
        </TransitionGroup>
        <TransitionGroup
          className="ml-3 mr-3"
          style={{
            marginTop: 120,
            display: 'flex',
            justifyContent: 'center',
            // border: 'solid 5px rosybrown',
            zIndex: 2000
          }}
        >
          {cards.map((c, i) => (
            <Transition key={c.id} timeout={duration}>
              {state => (
                <div
                  className="ml-1 mr-1"
                  style={{
                    width: '4vw',
                    height: '4vw',
                    border: 'solid 2px rosybrown',
                    borderRadius: '50%',
                    background: selectedCardIndex === i ? 'rosybrown' : 'white',
                    opacity: dotOpacity[state],
                    transition: 'opacity 0.3s',
                    zIndex: 2000
                  }}
                />
              )}
            </Transition>
          ))}
        </TransitionGroup>
      </div>
    );
  }
}
export default throttle(1000)(CardGrid);
