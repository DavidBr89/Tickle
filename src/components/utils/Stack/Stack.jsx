import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { range, scaleBand, min, max, scaleLinear } from 'd3';
// import VisibilitySensor from 'react-visibility-sensor/visibility-sensor.js';

const isPosInt = n => Number.isInteger(n) && n >= 0;

function centerLayout({
  slotSize,
  width,
  height,
  data,
  selectedIndex,
  direction
}) {
  //TODO: fix Pagination
  const size = direction === 'horizontal' ? width : height;

  const center = size / 2;

  const leftLen = selectedIndex + 1;
  const rightLen = data.length - selectedIndex;
  const leftSize = center - (slotSize * 3) / 2;

  const rightSize = size - (slotSize * 3) / 2 - center;

  const leftPos = j => (j * leftSize) / leftLen;

  const rightPos = j =>
    center + slotSize / 2 + ((rightLen - j) * rightSize) / rightLen;

  const leftPositions = data
    .slice(0, selectedIndex)
    .slice(selectedIndex > 10 ? 7 : 0, selectedIndex)
    .map((c, j) => ({
      index: c.index,
      position: 'left',
      pos: leftPos(j),
      zIndex: j
    }));

  const centerIndex = data[selectedIndex] ? data[selectedIndex].index : 0;

  const centerPos = {
    index: centerIndex,
    position: 'center',
    zIndex: 100,
    pos: center - slotSize / 2
  };

  const rightPositions = data
    .slice(selectedIndex + 1, data.length)
    // TODO: Pagination
    // .slice(-7)
    .reverse()
    .map((c, j) => ({
      index: c.index,
      position: 'right',
      pos: rightPos(j),
      zIndex: j
    }));

  return [...leftPositions, centerPos, ...rightPositions];
}

const baseLayout = ({
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
}) => {
  const availSpace = direction === 'horizontal' ? width : height;
  const neededSpace = data.length * slotSize;

  const size =
    neededSpace < availSpace ? neededSpace - slotSize : availSpace - slotSize;
  const buffer = size < availSpace ? (availSpace - size - slotSize) / 2 : 0;

  // TODO: parameterize
  const len = Math.min(data.length, 20);
  const scale = scaleBand()
    .domain(range(0, len))
    .paddingInner(1)
    // .align(0.5)
    .range([buffer, buffer + size]);
  // i => i * (100 - slotSize * 3 / 4) / data.length;
  return data.slice(0, len).map((d, i) => ({ index: d.index, pos: scale(i) }));
};

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
    unit: 'px',
    slotSize: 100 / 3,
    centered: true,
    children: d => d,
    selectedIndex: 0,
    direction: 'horizontal'
  };

  render() {
    const {
      data,
      // innerMargin,
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

    if (data.length === 0) return null;

    if (centered && !isPosInt(selectedIndex))
      throw new Error(
        `SelectedIndex ${selectedIndex} is not a positive integer`
      );
    // const { cardStacks } = this.state;

    // TODO: change later, i as key is not good
    const keyData = data.map((d, i) => ({ ...d, index: i }));

    const dataPos = centered
      ? centerLayout({ ...this.props, data: keyData })
      : baseLayout({ ...this.props, data: keyData });

    const centerPos = c =>
      direction === 'vertical'
        ? { top: `${c.pos}${unit}` }
        : { left: `${c.pos}${unit}`, zIndex: c.zIndex };

    const slotWidth = `${slotSize}${unit}`;

    return (
      <div
        className={className}
        style={{
          ...style,
          height: `${height}${unit}`,
          width: `${width}${unit}`,
          position: 'relative'
        }}
      >
        {keyData.map((d, i) => {
          const p = dataPos.find(e => e.index === d.index) || null;
          if (p === null) return null;

          const pos = centerPos(p);
          return (
            <div
              key={d.index}
              style={{
                position: 'absolute',
                cursor: 'pointer',
                transition: `left ${duration}ms, top ${duration}ms, transform ${duration}ms`,
                width: slotWidth,
                height: '100%',
                ...pos
              }}
            >
              {children(d, i)}
            </div>
          );
        })}
      </div>
    );
  }
}

export default CardStack;
