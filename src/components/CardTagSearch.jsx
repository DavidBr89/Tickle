import React from 'react';
import PropTypes from 'prop-types';
import { TagDropDown } from 'Utils/TagInput';

function CardTagSearch({
  allTags,
  data,
  onChange,
  onSelect,
  onSubmit,
  height,
  ...props
}) {
  return (
    <div
      className="flex-grow m-2 z-20"
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        position: 'relative'
        // width: 30
      }}
    >
      <TagDropDown
        className="mr-1"
        key={data.join(',')}
        onChange={onChange}
        onInputSelect={onSelect}
        height={height}
        vocabulary={allTags}
        style={
          {
            // width: '70%',
            // maxWidth: 400
          }
        }
        onClick={onSubmit}
        data={data}
      />
    </div>
  );
}

CardTagSearch.defaultProps = {};

CardTagSearch.propTypes = {};

export default CardTagSearch;