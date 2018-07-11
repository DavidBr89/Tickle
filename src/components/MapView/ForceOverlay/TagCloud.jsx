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
  <div style={{ display: 'flex' }}>
    {d3
      .range(0, number)
      .map(() => <CardMarker style={{ width: '2vh', height: '2vh' }} />)}
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
      position: 'absolute',
      transition: `left ${transition}ms, top ${transition}ms, width ${transition}ms, height ${transition}ms`,
      cursor: 'pointer',
      background: highlighted && color,
      border: selected ? 'grey dashed 4px' : `${color} solid 8px`,
      display: 'flex',
      alignItems: 'center'
      // paddingTop: height / 4,
      // paddingBottom: height / 4
    };
    return (
      <div style={st} onClick={() => onClick(children)}>
        <div
          style={{
            width: '100%'
            // height: '100%'
          }}
        >
          <div
            style={{
              // height: '100%',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <div
              className="mr-2"
              style={{
                fontSize: '2vh',
                // width: '100%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              #{children}
            </div>
            <div className="pl-1 pr-1" style={{ maxWidth: '100%' }}>
              <CardStack number={count} />
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
      // addCardFilter,
      // removeCardFilter,
      tagFilter,
      filterSet
    } = this.props;

    const treemap = data.map((d, i) => (
      <Tag
        {...d}
        {...d.data}
        key={d.data.key}
        filterSet={filterSet}
        onClick={tag => tagFilter({ tag, filterSet})}
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
