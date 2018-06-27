import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
// import tsnejs from 'tsne';
import _ from 'lodash';

import ReactDom from 'react-dom';
// import sketchy from '../utils/d3.sketchy';

import cxx from './TagCloud.scss';

import { CardMarker } from 'Cards';

const CardStack = ({ number }) => (
  // const scale = d3
  //   .scaleLinear()
  //   .domain([0])
  //   .range([30, 100]);

  <div style={{ display: 'flex' }}>
    {d3.range(0, number).map(() => (
      <div style={{ width: `${100 / number}%` }}>
        <div style={{ width: 25, height: 30, opacity: 0.9 }}>
          <CardMarker />
        </div>
      </div>
    ))}
    {number === 0 && <div>No Cards!</div>}
  </div>
);

// const setChildrenToInheritFontSize = el => {
//   el.style.fontSize = 'inherit';
//   console.log('children', el.children);
//   _.each(el.children, child => {
//     setChildrenToInheritFontSize(child);
//   });
// };
function autoSizeText(container, attempts = 200, width, height, count) {
  const resizeText = el => {
    attempts--;
    let elNewFontSize;
    if (
      el.style.fontSize === '' ||
      el.style.fontSize === 'inherit' ||
      el.style.fontSize === 'NaN'
    ) {
      elNewFontSize = `${Math.max(20, 20 * count)}px`; // largest font to start with
    } else {
      elNewFontSize = `${parseInt(el.style.fontSize.slice(0, -2), 10) - 1}px`;
    }
    el.style.fontSize = elNewFontSize;

    // this function can crash the app, so we need to limit it
    if (attempts <= 0) {
      return;
    }

    if (el.scrollWidth > width || el.scrollHeight > height) {
      resizeText(el);
    }
  };
  // setChildrenToInheritFontSize(container);
  resizeText(container);
}

class Tag extends React.Component {
  static propTypes = {
    children: PropTypes.array.isRequired,
    width: PropTypes.array.isRequired,
    height: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    highlighted: PropTypes.bool.isRequired,
    top: PropTypes.number.isRequired,
    padding: PropTypes.number.isRequired
  };

  static defaultProps = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    children: 0,
    color: 'blue',
    fill: 'white',
    padding: 2,
    clickHandler: () => null
  };

  componentDidMount() {
    const node = ReactDom.findDOMNode(this.node);
    const { width, height, padding, count } = this.props;
  }

  render() {
    const {
      left,
      top,
      width,
      height,
      color,
      fill,
      data,
      onMouseEnter,
      onMouseLeave,
      padding,
      highlighted,
      count,
      active,
      addCardFilter,
      removeCardFilter,
      filterSet
    } = this.props;

    const st = {
      left,
      top,
      width,
      height,
      // background: color,
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      transition: 'all',
      cursor: 'pointer',
      opacity: !active && 0.3

      // borderRadius: '100%'
      // marginLef: '100%'
      // transition: 'width 1s height 2s'
      // padding: 10
      // border: 'black groove',
      // borderRadius: '10%',
    };
    return (
      <div style={st} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <div
          onClick={() =>
            filterSet.includes(data.key)
              ? removeCardFilter([data.key])
              : addCardFilter([data.key])
          }
          style={{
            width: '90%',
            height: '90%',
            padding: '2%',
            background: color,
            borderRadius: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div>
            <div
              style={{
                fontSize: '3vh',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {data.key}
            </div>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <CardStack number={count} />
              <div className="ml-3">{count}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class TagCloud extends React.Component {
  static propTypes = {
    docWidth: PropTypes.array.isRequired,
    docHeight: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    padX: PropTypes.number.isRequired,
    padY: PropTypes.number.isRequired
  };

  render() {
    const {
      colorScale,
      data,
      onHover,
      selectedTags,
      addCardFilter,
      removeCardFilter,
      filterSet
    } = this.props;

    const treemap = data.map((d, i) => (
      <Tag
        {...d}
        filterSet={filterSet}
        addCardFilter={addCardFilter}
        removeCardFilter={removeCardFilter}
        key={d.data.key}
        color={colorScale(d.data.key)}
        count={d.data.count}
        active={selectedTags.includes(d.data.key)}
        index={i}
        onMouseEnter={() => onHover(d.data.key)}
        onMouseLeave={() => onHover(null)}
      />
    ));

    return <div>{treemap}</div>;
  }
}

TagCloud.defaultProps = {
  width: 800,
  height: 400,
  padX: 0,
  padY: 0,
  clickHandler: () => null,
  color: () => 'red',
  getCoords: d => d
};

export default TagCloud;
