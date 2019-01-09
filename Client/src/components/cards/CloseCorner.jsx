import React from 'react';
import PropTypes from 'prop-types';

function CloseCorner({ className, width, height, ...props }) {
  return (
    <svg
      version="1.1"
      width={width}
      height={height}
      x="0px"
      y="0px"
      viewBox="0 0 56.7 56.7"
      style={{ enableBackground: 'new 0 0 56.7 56.7' }}
      xmlSpace="preserve"
    >
      <g id="Layer_1">
        <polygon points="0,6 56.8,56.7 0,56.7 	" style={{fill:"#404040"}} />
        <polygon
          style={{ fill: 'white' }}
          points="25.8,34.3 22.4,31 14.9,38.5 7.4,31 4.1,34.3 11.6,41.8 4.1,49.3 7.4,52.7 14.9,45.2 22.4,52.7
		25.8,49.3 18.3,41.8 	"
        />
      </g>
    </svg>
  );
}

CloseCorner.defaultProps = { width: 50, height: 50 };

CloseCorner.propTypes = {};

export default CloseCorner;
