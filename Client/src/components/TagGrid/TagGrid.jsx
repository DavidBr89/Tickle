import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as d3 from 'd3';

import icAk from 'Src/styles/alphabet_icons/ic_ak.svg';


function calcTreeMap({
  data, width, height, padX, padY
}) {
  const ratio = 2;
  const sorted = data.sort((a, b) => b.values.length - a.count);
  const treemap = d3
    .treemap()
    .size([width / ratio, height])
    .paddingInner(0)
    .paddingOuter(0)
    .round(true)
    .tile(d3.treemapResquarify);

  const size = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.count))
    .range([20, 25]);

  const first = { name: 'root', children: sorted };
  const root = d3.hierarchy(first).sum(d => size(d.count));

  treemap(root);
  if (!root.children) return [];
  root.children.forEach((d) => {
    d.left = padX / 2 + Math.round(d.x0 * ratio);
    d.top = padY / 2 + Math.round(d.y0);

    d.width = Math.round(d.x1 * ratio) - Math.round(d.x0 * ratio) - padX / 2;
    d.height = Math.round(d.y1) - Math.round(d.y0) - padY / 2;
  });

  return root.children;
  // const padY = 10;
  // const padX = 20;
}

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
      left, top, width, height, color, data, onMouseEnter, onMouseLeave,
      padding, highlighted, count, addCardFilter, removeCardFilter,
      filterSet, selected, onClick, key, children, transition, small
    } = this.props;

    const st = {
      left,
      top,
      width,
      height,
      position: 'absolute',
      transition: `left ${transition}ms, top ${transition}ms, width ${transition}ms, height ${transition}ms`
    };

    return (
      <div
        className={`flex flex-col border-8 border-black p-4 ${selected
          && 'bg-grey-light'}`}
        style={st}
        onClick={() => onClick(children)}
      >
        <div className="relative flex flex-col flex-grow">
          <h1 className="absolute">
            {children}
          </h1>
          <div
            className="flex-grow flex flex-col items-center justify-center"
          >
            <div
              className="p-4 flex items-center justify-center"
            >
              <div className=" border-4 border-black "><img className="m-2" src={icAk} /></div>
              <div className="text-2xl font-bold ml-2">{count}</div>

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
      width,
      height,
      tagFilter,
      filterSet
    } = this.props;

    console.log('treemap props', this.props);
    const trData = calcTreeMap({
      data,
      width,
      height,
      // TODO
      padX: 10,
      padY: 10
    });

    const treemap = trData.map((d, i) => (
      <Tag
        {...d}
        {...d.data}
        key={d.data.key}
        filterSet={filterSet}
        onClick={tag => tagFilter({ tag, filterSet })}
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
  mergeProps,
)(TagCloud);
