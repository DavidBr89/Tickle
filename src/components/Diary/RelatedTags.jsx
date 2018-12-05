import React, {Component} from 'react';
import PropTypes from 'prop-types';

import PreviewCard from 'Components/cards/PreviewCard';

import PreviewCardStack from 'Components/cards/PreviewCardStack';

class RelatedTags extends Component {
  static propTypes = {
    children: PropTypes.node,
    nestedTags: PropTypes.array,
  };

  render() {
    const {nestedTags, selectedCard, className} = this.props;

    const gridStyle = {
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fill, 100px)`,
      gridGap: '1rem',
      gridAutoRows: '140px',
    };

    console.log('RelatedTags xxx yoyoyoyo');
    return (
      <div
        className={`${className} flex flex-col items-center
          justify-center w-full `}>
        <div className="p-2 w-full h-full" style={gridStyle}>
          <PreviewCard
            {...selectedCard}
            className="p-5"
            style={{
              // position: 'absolute',
              gridColumn: 'span 2',
              gridRow: 'span 2',
            }}
          />
          {nestedTags.map(n => (
            <PreviewCardStack {...n} name={n.tag} />
          ))}
        </div>
      </div>
    );
  }
}

export default RelatedTags;
