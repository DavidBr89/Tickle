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

class Tag extends React.Component {
  static propTypes = {
    children: PropTypes.array.isRequired,
    width: PropTypes.array.isRequired,
    height: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    highlighted: PropTypes.bool.isRequired,
    top: PropTypes.number.isRequired,
    padding: PropTypes.number.isRequired,
    transition: PropTypes.number
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
    clickHandler: () => null,
    transition: 750
  };

  // componentDidMount() {
  //   const node = ReactDom.findDOMNode(this.node);
  //   const { width, height, padding, count } = this.props;
  // }

  render() {
    const {
      left,
      top,
      width,
      height,
      color,
      data,
      onMouseEnter,
      onMouseLeave,
      padding,
      highlighted,
      count,
      addCardFilter,
      removeCardFilter,
      filterSet,
      selected,
      onClick,
      key,
      children,
      transition
    } = this.props;

    const st = {
      left,
      top,
      width,
      height,
      // background: color,
      position: 'absolute',
      // display: 'flex',
      // justifyContent: 'center',
      // alignItems: 'center',
      transition: `left ${transition}ms, top ${transition}ms, width ${transition}ms, height ${transition}ms`,
      cursor: 'pointer',
      background: highlighted && color,
      border: selected ? 'grey dashed 4px' : `${color} solid 8px`

      // borderRadius: `${10 / width}%`
      // marginLef: '100%'
      // transition: 'width 1s height 2s'
      // padding: 10
      // border: 'black groove',
      // borderRadius: '10%',
    };
    return (
      <div style={st} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <div
          className="p-2"
          onClick={() => onClick(children)}
          style={{
            width: '100%',
            height: '100%',
            // padding: '2%',
            flexWrap: 'wrap',
            borderRadius: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              // width: '100%',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <div
              className="mr-2"
              style={{
                fontSize: '3vh',
                // width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              #{children}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CardStack number={count} />
              <div className="ml-2">{count}</div>
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
      selectedTags,
      addCardFilter,
      removeCardFilter,
      filterSet
    } = this.props;

    const treemap = data.map((d, i) => (
      <Tag
        {...d}
        {...d.data}
        key={d.data.key}
        filterSet={filterSet}
        onClick={tag =>
          filterSet.includes(tag)
            ? removeCardFilter([tag])
            : addCardFilter([tag])
        }
        color={colorScale(d.data.key)}
        highlighted={selectedTags.includes(d.data.key)}
        selected={filterSet.includes(d.data.key)}
      >
        {d.data.key}
      </Tag>
    ));

    return <div style={{ position: 'relative' }}>{treemap}</div>;
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
