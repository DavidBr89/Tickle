import React from 'react';
import PropTypes from 'prop-types';
import { DropDown } from 'Utils/TagInput';

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
      className="m-2"
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        zIndex: 2000,
        position: 'relative'
        // width: 30
      }}
    >
      <DropDown
        className="mr-1"
        key={data.join(',')}
        onChange={onChange}
        onInputSelect={onSelect}
        height={height}
        vocabulary={allTags}
        style={{
          width: '70%'
        }}
        onClick={onSubmit}
        data={data}
      />
    </div>
  );
}

CardTagSearch.defaultProps = {};

CardTagSearch.propTypes = {};

export default CardTagSearch;
