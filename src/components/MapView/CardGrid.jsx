import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
// import VisibilitySensor from 'react-visibility-sensor/visibility-sensor.js';

function centerLayout() {
  const { slotSize, width, data, selectedIndex } = this.props;
  const center = width / 2;

  const leftLen = selectedIndex + 1;
  const rightLen = data.length - selectedIndex;

  // TODO: simplify
  const leftScale = j =>
    center -
    slotSize * 3 / 2 -
    (leftLen - j) * (center - slotSize * 3 / 2) / leftLen;
  //
  const rightScale = j =>
    center +
    slotSize / 2 +
    (rightLen - j) * (width - slotSize - center - slotSize / 2) / rightLen;

  const leftCards = data
    .slice(0, selectedIndex)
    // TODO
    // .reverse()
    .map((c, j) => ({
      id: c.id,
      position: 'left',
      i: 0,
      j,
      pos: leftScale(j),
      zIndex: j
      // j
    }));
  // .reverse();

  const centerCard = [
    {
      ...data[selectedIndex],
      position: 'center',
      i: 1,
      j: 0,
      zIndex: 100,
      pos: center - slotSize / 2
    }
  ];

  const rightCards = data
    .slice(selectedIndex + 1, data.length)
    .reverse()
    .map((c, j) => ({
      ...c,
      position: 'right',
      i: 2,
      j,
      pos: rightScale(j),
      zIndex: j
    }));

  return { leftCards, centerCard, rightCards };
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
    const cardStacks = centerLayout.bind(this)();
    this.state = {
      cardStacks
    };

    // TODO: check later
    // this.transitionStyles = transition.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;

    const cardStacks = centerLayout.bind(this)(data, nextProps.selectedIndex);
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
      centered,
      selectedIndex,
      duration
    } = this.props;

    const cardStacks = centerLayout.bind(this)(data, selectedIndex);
    const { leftCards, centerCard, rightCards } = cardStacks;
    const allCards = [...leftCards, ...centerCard, ...rightCards];

    const transition = `left ${duration / 1000}s, transform ${duration /
      1000}s`;

    if (!centered) {
      const scale = d3
        .scaleBand()
        .domain(d3.range(0, data.length))
        .paddingInner(1)
        // .align(0.5)
        .range([0, width - slotSize]);
      // i => i * (100 - slotSize * 3 / 4) / data.length;
      return (
        <div style={{ ...style, position: 'relative' }}>
          <div
            className={className}
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
                  transition
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
          {data.map(d => {
            const c = allCards.find(e => e.id === d.id);
            return (
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
                  left: `${c.pos}${unit}`,
                  transition,
                  zIndex: c.zIndex
                }}
              >
                {children(d)}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default CardGrid;
