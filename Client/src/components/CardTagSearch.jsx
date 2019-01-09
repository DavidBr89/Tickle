import React, {useState} from 'react';
import PropTypes from 'prop-types';

import SlideMenu from 'Components/utils/SlideMenu';

function CardTagFilter({
  tags,
  filterSet,
  onChange,
  onSelect,
  onClick,
  height,
  ...props
}) {
  const [setFilteredTags, filteredTags] = useState(tags);
  return (
    <div className="flex justify-end relative m-2 z-20">
      <SlideMenu className="flex-grow">
        <h3>Tags</h3>
        <div className="mt-3 flex flex-wrap">
          {tags.map(d => (
            <div
              className={`cursor-pointer tag-label m-1
                ${filterSet.includes(d.key) ? 'bg-black' : 'bg-grey'}`}
              onClick={() => {
                onClick(d.key);
              }}>
              {d.key}
            </div>
          ))}
        </div>
      </SlideMenu>
    </div>
  );
}

CardTagFilter.defaultProps = {};

CardTagFilter.propTypes = {};

export default CardTagFilter;
