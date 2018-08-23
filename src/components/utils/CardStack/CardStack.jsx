import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { range, scaleBand, min, max, scaleLinear } from 'd3';
// import VisibilitySensor from 'react-visibility-sensor/visibility-sensor.js';

function centerLayout({
  slotSize,
  width,
  height,
  data,
  selectedIndex,
  direction
}) {
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
    // TODO: change later
    .slice(selectedIndex > 10 ? 7 : 0, selectedIndex)
    .map((c, j) => ({
      index: c.index,
      position: 'left',
      pos: leftPos(j),
      zIndex: j
    }));

  if (!Number.isInteger(selectedIndex) || selectedIndex < 0)
    throw new Error(`SelectedIndex ${selectedIndex} is not a positive integer`);

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
    .slice(0, 10)
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

  // TODO: parameterize
  const len = Math.min(data.length, 20);
  const scale = scaleBand()
    .domain(range(0, len))
    .paddingInner(1)
    // .align(0.5)
    .range([0, size]);
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
    const tmpData = data.map((d, i) => ({ ...d, index: i }));
    const dataPos = centered
      ? centerLayout({ ...this.props, data: tmpData })
      : baseLayout({ ...this.props, data: tmpData });

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
          }}
        >
          {tmpData.map((d, i) => {
            const p = dataPos.find(e => e.index === d.index) || null;
            if (p === null) return null;
            return (
              <div
                key={p.index}
                style={{
                  position: 'absolute',
                  paddingLeft: `${innerMargin / 2}${unit}`,
                  paddingRight: `${innerMargin / 2}${unit}`,
                  cursor: 'pointer',
                  transition: `left ${duration}ms, top ${duration}ms, transform ${duration}ms`,
                  zIndex: p.zIndex,
                  width: '100%',
                  height: '100%',
                  ...size,
                  ...centerPos(p)
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
