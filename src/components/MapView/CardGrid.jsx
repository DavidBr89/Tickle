import React, { Component } from 'react';
import PropTypes from 'prop-types';
import VisibilitySensor from 'react-visibility-sensor/visibility-sensor.js';

import { TransitionGroup, Transition } from 'react-transition-group/';
import { ScrollView, ScrollElement } from '../utils/ScrollView';
import { PreviewCard } from '../cards';

class CardGrid extends Component {
  static propTypes = {
    cards: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    onExtend: PropTypes.func.isRequired,
    controls: PropTypes.node.isRequired,
    setCardOpacity: PropTypes.func.isRequired,
    offset: PropTypes.number.isRequired,
    reset: PropTypes.bool,
    style: PropTypes.object
  };

  static defaultProps = {
    style: {},
    selectedCard: null,
    setCardOpacity(d) {
      return d;
    }
  };

  constructor(props) {
    super(props);
    this.id = null;
    this.box = null;
    this.state = { selectedCardId: props.selectedCard, reset: false };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reset) this.setState({ selectedCardId: null });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.selectedCardId !== nextState.selectedCardId ||
      this.props.controls.key !== nextProps.controls.key ||
      this.props.reset !== nextProps.reset
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
      // console.log('scroll', this.scrollCont)
      // this.scrollCont.scrollLeft = this.scrollCont.scrollWidth;
      // // this._scroller.scrollTo(selectedCardId);
    }
    // this.scrollCont.scrollWidth = this.scrollCont.scrollWidth * 2;
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
    const { cards, onExtend, style, controls, onSelect } = this.props;
    const { selectedCardId } = this.state;

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

    const selectedCards = (() => {
      if (selectedCardId === null) return cards.slice(0, 3);

      const selectedCardIndex = cards.findIndex(d => d.id === selectedCardId);
      if (selectedCardIndex === cards.length - 1) return cards.slice(-3);

      return [
        cards[selectedCardIndex - 1],
        cards[selectedCardIndex],
        cards[selectedCardIndex + 1]
        // cards[selectedCardIndex + 2]
      ];
    })();

    console.log('selectedCards', selectedCards);

    const duration = 0.5;
    const defaultStyle = {
      transition: `left ${0.6}s`
    };

    const slotSize = 100 / selectedCards.length;
    console.log('slotSize', slotSize);
    const transitionStyles = i => {
      const left = (() => {
        if (i === 2) return `${selectedCards.length * slotSize}vw`;
        if (i === 0) return `${0}vw`;
        return `${slotSize * i}vw`;
      })();

      return {
        entering: { left },
        entered: { left: `${i * slotSize}vw` },
        exiting: { left },
        exited: { left }
      };
    };

    return (
      <div>
        <div
          style={{
            position: 'absolute',
            overflowX: 'hidden',
            width: '100%',
            height: '40vh',
            // paddingLeft: '50vw',
            // paddingRight: '50vw',
            zIndex: 2000
          }}
        >
          <TransitionGroup
            style={{
              ...style
            }}
          >
            <div style={{ width: '40vw' }} />
            {selectedCards.map((d, i) => (
              <Transition key={d.id} timeout={10}>
                {state => (
                  <div
                    style={{
                      width: '28vw',
                      marginLeft: '3vw',
                      marginRight: '3vw',
                      cursor: 'pointer',
                      position: 'absolute',
                      // left: `${i * 33}vw`,
                      ...transitionStyles(i)[state],
                      transition: 'left 0.3s',
                      transitionTimingFunction:
                        state === 'entering' ? 'ease-in' : 'ease-out'
                    }}
                  >
                    {console.log(
                      'transitionStyles',
                      i,
                      state,
                      transitionStyles(i)[state]
                    )}
                    <div>
                      <div style={{ opacity: selectedCardId === d.id ? 1 : 0 }}>
                        {controls}
                      </div>
                    </div>
                    <PreviewCard
                      {...d}
                      onClick={() =>
                        selectedCardId === d.id
                          ? onExtend(d.id)
                          : this.setState({ selectedCardId: d.id })
                      }
                      selected={selectedCardId === d.id}
                      style={{
                        opacity: selectedCardId === d.id ? 1 : 0.56,
                        // transform:
                        // selectedCardId === d.id ? 'scale(1.2)' : null,
                        transition: 'transform 1s',
                        height: '100%',
                        padding: '10px'
                      }}
                    />
                  </div>
                )}
              </Transition>
            ))}
          </TransitionGroup>
        </div>
      </div>
    );
  }
}
export default CardGrid;
