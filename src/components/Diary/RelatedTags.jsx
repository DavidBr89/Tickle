import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PreviewCard from 'Components/cards/PreviewCard';

const CardStack = ({ values, tag }) => (
  <div className="border flex flex-col">
    <div className="flex-grow flex flex-col p-1">
      <h4>{tag}</h4>
      <div className="flex-grow relative mt-2 mr-3 mb-3">
        <div
          className="border border-green-dark bg-white h-full w-full absolute"
          style={{ transform: 'translate3d(10px,10px,-200px)' }}
        />
        <div
          className="border border-grey-dark bg-white h-full w-full absolute"
          style={{ transform: 'translate3d(5px,5px,-100px)' }}
        />
        <div
          className="border border-grey-dark bg-white h-full w-full absolute"
          style={{ transform: 'translate3d(0,0,-150px)' }}
        />
      </div>
    </div>
  </div>
);

CardStack.defaultProps = {
  cards: []
};

class RelatedTags extends Component {
  static propTypes = {
    children: PropTypes.node,
    nestedTags: PropTypes.array
  };

  render() {
    const { nestedTags, className } = this.props;

    const gridStyle = {
      // height: '100%',
      display: 'grid',
      // gridAutoFlow: 'column dense',
      gridTemplateColumns: `repeat(auto-fill, minmax(140px, 1fr))`,
      gridGap: '1rem',
      gridAutoRows: '1fr'
      // gridTemplateRows: `repeat(${Math.ceil(
      //   cards.length / tmpColNum
      // )}, ${tmpRowHeight}px)`
    };

    return (
      <div style={{ position: 'absolute' }} className={className}>
        <div className="h-full w-full p-2" style={gridStyle}>
          {nestedTags.map(n => <CardStack {...n} />)}
        </div>
      </div>
    );
  }
}

export default RelatedTags;
