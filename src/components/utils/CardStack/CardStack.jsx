import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { range, scaleBand } from 'd3';
// import VisibilitySensor from 'react-visibility-sensor/visibility-sensor.js';

function centerLayout(nextProps) {
  const { slotSize, width, data, selectedIndex } = nextProps || this.props;
  const center = width / 2;

  const leftLen = selectedIndex + 1;
  const rightLen = data.length - selectedIndex;

  // TODO: simplify
  const leftScale = j =>
    center -
    (slotSize * 3) / 2 -
    ((leftLen - j) * (center - (slotSize * 3) / 2)) / leftLen;
  //
  const rightScale = j =>
    center +
    slotSize / 2 +
    ((rightLen - j) * (width - slotSize - center - slotSize / 2)) / rightLen;

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
    selectedIndex: PropTypes.number,
    direction: PropTypes.oneOf(['horizontal', 'vertical'])
  };

  static defaultProps = {
    style: {},
    className: '',
    data: [],
    duration: 100,
    width: 100,
    innerMargin: 0,
    unit: 'vw',
    slotSize: 100 / 3,
    centered: true,
    children: d => d,
    selectedIndex: 0,
    direction: 'horizontal'
  };

  constructor(props) {
    super(props);
    const cardStacks = centerLayout.bind(this)(props);
    this.state = {
      cardStacks
    };

    // TODO: check later
    // this.transitionStyles = transition.bind(this);
  }

  static getDerivedStateFromProps(nextProps) {
    const cardStacks = centerLayout.bind(this)(nextProps);
    return { cardStacks };
  }

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
      duration,
      height,
      onClick,
      direction
    } = this.props;

    const { cardStacks } = this.state;

    const { leftCards, centerCard, rightCards } = cardStacks;
    const allCards = [...leftCards, ...centerCard, ...rightCards];

    const transition = `left ${duration}ms, transform ${duration}ms`;

    // TODO: reorder
    if (!centered) {
      const scale = scaleBand()
        .domain(range(0, data.length))
        .paddingInner(1)
        // .align(0.5)
        .range([0, width - slotSize]);
      // i => i * (100 - slotSize * 3 / 4) / data.length;
      const position = i =>
        direction === 'vertical'
          ? { top: `${scale(i)}${unit}` }
          : { left: `${scale(i)}${unit}` };
      return (
        <div
          className={className}
          style={{ ...style, height: `${height}${unit}`, position: 'relative' }}
        >
          <div
            style={{
              perspective: '2400px',
              perspectiveOrigin: '50% -50%',
              width: '100%',
              height: '100%'
            }}
          >
            {data.map((d, i) => (
              <div
                key={d.id}
                style={{
                  position: 'absolute',
                  width: `${slotSize - innerMargin}${unit}`,
                  height: '100%',
                  // maxWidth: '200px',
                  paddingLeft: `${innerMargin / 2}${unit}`,
                  paddingRight: `${innerMargin / 2}${unit}`,
                  cursor: 'pointer',
                  transition,
                  ...position(i)
                }}
              >
                {children(d)}
              </div>
            ))}
          </div>
        </div>
      );
    }

    const centerPos = c =>
      direction === 'vertical'
        ? { top: `${c.pos}${unit}` }
        : { left: `${c.pos}${unit}` };
    return (
      <div
        className={className}
        style={{ ...style, height: `${height}${unit}`, position: 'relative' }}
      >
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
                style={{
                  position: 'absolute',
                  width: `${slotSize - innerMargin}${unit}`,
                  height: '100%',
                  // maxWidth: '200px',
                  paddingLeft: `${innerMargin / 2}${unit}`,
                  paddingRight: `${innerMargin / 2}${unit}`,
                  cursor: 'pointer',
                  // maxWidth: '200px',
                  transition,
                  zIndex: c.zIndex,
                  ...centerPos(c),
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

class AccordionWrapper extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    onChange: PropTypes.func
  };

  static defaultProps = { onChange: d => d };

  constructor(props) {
    super(props);
    this.state = { selectedIndex: null };
  }

  componentDidUpdate(prevProps, prevState) {
    const { selectedId } = this.state;
    clearTimeout(this.id);
    this.id = setTimeout(() => this.props.onChange(selectedId), 1000);
  }

  render() {
    const { data } = this.props;
    const { selectedIndex } = this.state;
    return (
      <CardGrid
        {...this.props}
        selectedIndex={this.state.selectedIndex}
        onClick={selectedId =>
          this.setState({
            selectedIndex: data.findIndex(d => d.id === selectedId),
            selectedId
          })
        }
      />
    );
  }
}

export default CardGrid;
