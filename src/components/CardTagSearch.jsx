import React from 'react';
import PropTypes from 'prop-types';
import {SelectTags} from 'Utils/TagInput';

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
    <div className="flex justify-end relative m-2 z-20">
      <SelectTags
        className="mr-1"
        key={data.join(',')}
        onChange={onChange}
        onInputSelect={onSelect}
        height={height}
        vocabulary={allTags}
        onClick={onSubmit}
        data={data}
      />
    </div>
  );
}

CardTagSearch.defaultProps = {};

CardTagSearch.propTypes = {};

export default CardTagSearch;
