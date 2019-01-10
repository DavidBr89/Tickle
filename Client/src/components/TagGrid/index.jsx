import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {wrapGrid} from 'animate-css-grid';

import * as d3 from 'd3';

import icAk from 'Styles/alphabet_icons/ic_ak.svg';

class Tag extends React.Component {
  static propTypes = {
    children: PropTypes.array.isRequired,
    width: PropTypes.array.isRequired,
    height: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    highlighted: PropTypes.bool.isRequired,
    top: PropTypes.number.isRequired,
    padding: PropTypes.number.isRequired,
    transition: PropTypes.number,
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
    transition: 750,
  };

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
      small,
    } = this.props;

    const st = {
      // width,
      // height,
      transition: `left ${transition}ms, top ${transition}ms, width ${transition}ms, height ${transition}ms`,
    };

    return (
      <div
        className={`shadow flex flex-col border-4 border-black p-4 ${selected &&
          'bg-grey-light'}`}
        style={st}
        onClick={() => onClick(children)}>
        <div className="relative items-center justify-between flex flex-wrap flex-grow">
          <h1 className="">{children}</h1>
          <div className="flex items-center" style={{height: 50}}>
            <div className=" border-4 border-black ">
              <img className="m-2" src={icAk} />
            </div>
            <div className="text-2xl font-bold ml-2">{count}</div>
          </div>
        </div>
      </div>
    );
  }
}

const TagGrid = props => {
  const gridDom = React.createRef();
  useEffect(() => {
    wrapGrid(gridDom.current, {
      // easing: 'easein',
      stagger: 0,
      duration: 800,
    });
  }, []);

  const {data, selectedTags, tagFilter, filterSet, className, style} = props;

  const cells = data.map((d, i) => (
    <Tag
      {...d}
      key={d.key}
      filterSet={filterSet}
      onClick={tag => tagFilter({tag, filterSet})}
      highlighted={selectedTags.includes(d.key)}
      selected={filterSet.includes(d.key)}>
      {d.key}
    </Tag>
  ));

  // const boxWidth = 300;
  // const boxHeight = 200;
  const templateRows = `minmax(1rem, 100px)`;
  return (
    <div
      ref={gridDom}
      className={className}
      style={{
        ...style,
        display: 'grid',
        // justifyItems: 'center',
        gridTemplateColumns: `repeat(auto-fit, minmax(20rem, 1fr))`,
        gridTemplateRows: templateRows,
        gridAutoRows: templateRows,
        gridGap: 16,
        gridAutoFlow: 'dense',
        justifyContent: 'center',
        // alignItems: 'center',
      }}>
      {cells}
    </div>
  );
};

TagGrid.defaultProps = {
  width: 800,
  height: 400,
  padX: 0,
  padY: 0,
  clickHandler: () => null,
  color: () => 'red',
  getCoords: d => d,
};

const mapStateToProps = state => ({...state.Screen});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...ownProps,
});

export default connect(
  mapStateToProps,
  null,
  mergeProps,
)(TagGrid);
