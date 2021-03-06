import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {wrapGrid} from 'animate-css-grid';

import icAk from '~/styles/alphabet_icons/ic_ak.svg';

/**
 * Tag Component to represent one topic in TagGrid
 */
const Tag = props => {
  const {count, selected, onClick, children, transition} = props;

  const st = {
    // width,
    // height,
    transition: `left ${transition}ms, top ${transition}ms, width ${transition}ms, height ${transition}ms`
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
};

/**
 * Grid Component for topics
 */
const TagGrid = props => {
  const gridDom = React.createRef();
  useEffect(() => {
    wrapGrid(gridDom.current, {
      // easing: 'easein',
      stagger: 0,
      duration: 800
    });
  }, []);

  const {
    data,
    selectedTags,
    topicFilter,
    filterSet,
    className,
    style
  } = props;

  // TODO move out topicFilter
  const cells = data.map(d => (
    <Tag
      {...d}
      key={d.key}
      filterSet={filterSet}
      onClick={topic =>
          topicFilter({topic, filterSet})}
      highlighted={selectedTags.includes(d.key)}
      selected={filterSet.includes(d.key)}>
      {d.key}
    </Tag>
  ));

  const templateRows = `minmax(1rem, 100px)`;
  return (
    <div
      ref={gridDom}
      className={className}
      style={{
        ...style,
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(20rem, 1fr))`,
        gridTemplateRows: templateRows,
        gridAutoRows: templateRows,
        gridGap: 16,
        gridAutoFlow: 'dense',
        justifyContent: 'center'
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
  getCoords: d => d
};

const mapStateToProps = state => ({...state.Screen});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...ownProps
});

// TODO move out redux
export default connect(
  mapStateToProps,
  null,
  mergeProps
)(TagGrid);
