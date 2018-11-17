import React, {Component} from 'react';
import PropTypes from 'prop-types';
import intersection from 'lodash/intersection';
import PreviewCard from 'Components/cards/PreviewCard';

const TagStack = ({title}) => (
  <div>
    <h2 className="tag-label">{ title }</h2>
    <PreviewCard />
  </div>
);

class RelatedTags extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  render() {
    const {collectibleCards, tags, tagVocabulary} = this.props;
    console.log('tags', tags);
    const cards = collectibleCards;

    //   collectibleCards.filter(
    //   c => intersection(c.tags, tags).length > 0,
    // );
    return (
      <div className="m-2">
        <div className="flex mb-2">
          <h2 className="tag-label">Tags</h2>
        </div>
        <div
          style={{
            display: 'grid',
            gridGap: 10,
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px,1fr))',
            gridAutoRows: 100,
          }}>
          {tagVocabulary.map(d => (
            <TagStack title={d.key} />
          ))}
        </div>
        ass
      </div>
    );
  }
}

export default RelatedTags;
