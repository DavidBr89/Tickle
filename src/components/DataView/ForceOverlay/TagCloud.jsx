import React from 'react';
import PropTypes from 'prop-types';
import { range } from 'd3';
// import tsnejs from 'tsne';
// import _ from 'lodash';
import { connect } from 'react-redux';

import chroma from 'chroma-js';

// import ReactDom from 'react-dom';
// import sketchy from '../utils/d3.sketchy';

import { CardMarker } from 'Cards';

const CardStack = ({ number }) => (
  <div style={{ display: 'flex' }}>
    {range(0, number).map(() => (
      <CardMarker style={{ width: '2vh', height: '2vh' }} />
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
      transition,
      small
    } = this.props;

    const st = {
      left,
      top,
      width,
      height,
      position: 'absolute',
      transition: `left ${transition}ms, top ${transition}ms, width ${transition}ms, height ${transition}ms`,
      cursor: 'pointer',
      background: highlighted
        ? color
        : chroma(color)
            .alpha(0.4)
            .css()
      // border: selected ? 'grey dashed 4px' : `${color} solid 4px`,
      // display: 'flex',
      // alignItems: 'center'
      // paddingTop: height / 4,
      // paddingBottom: height / 4
    };

    return (
      <div className="flexCol" style={st} onClick={() => onClick(children)}>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <div style={{ position: 'absolute', zIndex: 100 }}><span>{children} ({count})</span></div>
          <div
            className="flexCol"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <div
              className="flexCol"
              style={{
                // border: 'grey 1px solid',
                borderRadius: '50%',
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                zIndez: 0
              }}
            >
              <CardMarker
                style={{ width: 20, height: 20, transform: null, zIndex: 0 }}
              />
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
      //
      //
      isSmartphone,
      tagFilter,
      filterSet
    } = this.props;

    const treemap = data.map((d, i) => (
      <Tag
        {...d}
        small={isSmartphone}
        {...d.data}
        key={d.data.key}
        filterSet={filterSet}
        onClick={tag => tagFilter({ tag, filterSet })}
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

const mapStateToProps = state => ({ ...state.Screen });

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...ownProps
});

export default connect(
  mapStateToProps,
  null,
  mergeProps
)(TagCloud);
