import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { range, scaleBand } from 'd3';
import * as d3 from 'd3';
// import VisibilitySensor from 'react-visibility-sensor/visibility-sensor.js';

function centerLayout(nextProps) {
  const { slotSize, width, height, data, selectedIndex, direction } = nextProps;
  const size = direction === 'horizontal' ? width : height;

  const center = size / 2;

  const leftLen = selectedIndex + 1;
  const rightLen = data.length - selectedIndex;

  const leftSize = center - (slotSize * 3) / 2;

  const rightSize = size - (slotSize * 3) / 2 - center;

  // const bufferLeft = index => (center - slotSize) / (leftLen - index);
  const leftPos = j => (j * leftSize) / leftLen;
  const leftScale = j => leftPos(j);
  // center - slotSize > slotSize ? bufferLeft(j) + leftPos(j) : leftPos(j);

  const rightPos = j =>
    center + slotSize / 2 + ((rightLen - j) * rightSize) / rightLen;

  // TODO: not correct, fix
  const rightScale = j => {
    switch (true) {
      case data.length > 3:
        return rightPos(j);
      // case data.length === 1:
      //   center - slotSize / 2;
    }
  };
  // rightPos(j) - bufferRight(j) >= center + slotSize / 2
  //   ? rightPos(j) - bufferRight(j)
  //   : rightPos(j);

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

  return [...leftCards, ...centerCard, ...rightCards];
}

class CardStack extends Component {
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

    // TODO: check later
    // this.transitionStyles = transition.bind(this);
  }

  // static getDerivedStateFromProps(nextProps) {
  //   const cardStacks = centerLayout.bind(this)(nextProps);
  //   return { cardStacks };
  // }

  baseLayout = () => {
    const {
      data,
      innerMargin,
      style,
      className,
      children,
      unit,
      slotSize,
      width,
      // centered,
      // selectedIndex,
      duration,
      height,
      onClick,
      direction
    } = this.props;

    const transition = `left ${duration}ms, top ${duration}ms, transform ${duration}ms`;

    const size = direction === 'horizontal' ? width : height;
    const scale = scaleBand()
      .domain(range(0, data.length))
      .paddingInner(1)
      // .align(0.5)
      .range([0, size - slotSize]);
    // i => i * (100 - slotSize * 3 / 4) / data.length;
    const plotData = data.map((d, i) => ({ ...d, pos: scale(i) }));
    const position = d =>
      direction === 'vertical'
        ? { top: `${d.pos}${unit}` }
        : { left: `${d.pos}${unit}` };

    return plotData;
    // return (
    //   <div
    //     className={className}
    //     style={{ ...style, height: `${height}${unit}`, position: 'relative' }}
    //   >
    //     <div
    //       style={{
    //         perspective: '2400px',
    //         perspectiveOrigin: '50% -50%',
    //         width: '100%',
    //         height: '100%'
    //       }}
    //     >
    //       {plotData.map((d, i) => (
    //         <div
    //           key={d.id}
    //           style={{
    //             position: 'absolute',
    //             width: `${slotSize - innerMargin}${unit}`,
    //             height: '100%',
    //             // maxWidth: '200px',
    //             paddingLeft: `${innerMargin / 2}${unit}`,
    //             paddingRight: `${innerMargin / 2}${unit}`,
    //             cursor: 'pointer',
    //             transition,
    //             ...position(d)
    //           }}
    //         >
    //           {children(d)}
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // );
  };

  hoverLayout = () => {
    const {
      slotSize,
      direction,
      width,
      height,
      data,
      innerMargin,
      style,
      className,
      children,
      unit,
      selectedIndex,
      // slotSize,
      // centered,
      // selectedIndex,
      duration,
      onClick
      // direction
    } = this.props;

    const size = direction === 'horizontal' ? width : height;

    const scale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([0, size - slotSize]);

    if (selectedIndex === null || selectedIndex < 0) {
      return data.map((c, i) => ({ ...c, pos: scale(i) }));
    }

    const xFirstLeft = d3
      .scaleLinear()
      .domain([0, selectedIndex - 1])
      .range([0, d3.max([scale(selectedIndex) - slotSize, 0])]);

    const xFirstRight = d3
      .scaleLinear()
      .domain([selectedIndex + 1, data.length - 1])
      .range([d3.min([scale(selectedIndex) + slotSize, size]), width]);

    return data.map((c, i) => {
      if (selectedIndex < i) {
        return { ...c, pos: xFirstRight(i) };
      }
      if (selectedIndex > i) {
        return { ...c, pos: xFirstLeft(i) };
      }
      if (selectedIndex === i || selectedIndex === data.length - 1) {
        return { ...c, pos: scale(i) };
      }
      return c;
    });
  };

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

    // const { cardStacks } = this.state;

    // TODO: change later
    const allCards =
      centered && data.length > 3
        ? centerLayout(this.props)
        : selectedIndex !== null
          ? this.hoverLayout()
          : this.baseLayout();

    // const allCards = [...leftCards, ...centerCard, ...rightCards];

    // TODO: reorder

    const centerPos = c =>
      direction === 'vertical'
        ? { top: `${c.pos}${unit}` }
        : { left: `${c.pos}${unit}` };

    const size =
      direction === 'horizontal'
        ? { width: `${slotSize - innerMargin}${unit}` }
        : { height: `${slotSize - innerMargin}${unit}` };

    return (
      <div
        className={className}
        style={{
          ...style,
          height: `${height}${unit}`,
          width: `${width}${unit}`,
          position: 'relative',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            perspective: '2400px',
            perspectiveOrigin: '50% -50%',
            height: '100%',
            width: '100%'
            // width: `${wh}${unit}`
          }}
        >
          {data.map((d, i) => {
            // important for KEY
            const c = allCards.find(e => e.id === d.id);
            return (
              <div
                key={d.id}
                style={{
                  position: 'absolute',
                  paddingLeft: `${innerMargin / 2}${unit}`,
                  paddingRight: `${innerMargin / 2}${unit}`,
                  cursor: 'pointer',
                  // maxWidth: '200px',
                  transition: `left ${duration}ms, top ${duration}ms, transform ${duration}ms`,
                  zIndex: c.zIndex,
                  ...size,
                  ...centerPos(c)
                }}
              >
                {children(d, i)}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export class CardStackControlled extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    onChange: PropTypes.func
  };

  static defaultProps = { onChange: d => d };

  state = { selectedIndex: null };

  render() {
    const { data } = this.props;
    const { selectedIndex } = this.state;
    return (
      <CardStack
        {...this.props}
        selectedIndex={this.state.selectedIndex}
        onClick={selectedId =>
          this.setState({
            selectedIndex: data.findIndex(d => d.id === selectedId),
            selectedId
          })
        }
      >
        <div />
      </CardStack>
    );
  }
}

export default CardStack;
