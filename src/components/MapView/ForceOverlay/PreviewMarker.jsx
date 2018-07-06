import React from 'react';
import PropTypes from 'prop-types';

import { CardMarker } from 'Cards';

const shadowStyle = {
  boxShadow: '3px 3px black',
  border: '1px solid #000'
  // border: '1px solid black'
};

const getShadowStyle = selected => (selected ? shadowStyle : {});

const PreviewMarker = ({
  selected,
  template,
  color,
  size = 25,
  offset = 100
}) => (
  <CardMarker
    color={color}
    style={{
      transform: selected && 'scale(1.5)',
      zIndex: selected && 5000,
      transition: 'transform 1s',
      ...getShadowStyle(selected),
      position: 'absolute',
      width: size,
      height: size // '13vw',
    }}
  />
);

PreviewMarker.defaultProps = {};

PreviewMarker.propTypes = {};

export default PreviewMarker;
