import React from 'react';
import PropTypes from 'prop-types';
import { DropDown } from 'Utils/TagInput';

function CardTagSearch({
  allTags,
  data,
  onChange,
  onSelect,
  onSubmit,
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
      }}
    >
      <DropDown
        className="mr-1"
        key={data.join(',')}
        onChange={onChange}
        onSelect={onSelect}
        vocabulary={allTags}
        style={{
          display: 'flex',
          // position: 'absolute',
          justifyContent: 'flex-end',
          marginTop: 10,
          marginRight: 10
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
