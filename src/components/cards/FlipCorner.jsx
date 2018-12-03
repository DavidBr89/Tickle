import React from 'react';
import PropTypes from 'prop-types';

function FlipCorner({ className, width, height, ...props }) {
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
        <polygon points="56.8,6 0.1,56.7 56.8,56.7 	" fill={
"#404040"
        }/>
        <path
          style={{ fill: 'white' }}
          className="st0"
          d="M49.2,33.8l3.3-2.1H41.7v4.2v3.2l3.9-2.9c1.9,1.2,3.1,3.4,3.1,5.7c0,3.7-3,6.8-6.8,6.8c-3.7,0-6.8-3-6.8-6.8
		c0-1.1,0.2-2.1,0.7-3l-3.7-1.8c-0.8,1.5-1.2,3.2-1.2,4.9c0,6,4.9,10.9,10.9,10.9c6,0,10.9-4.9,10.9-10.9
		C52.8,38.7,51.4,35.8,49.2,33.8z"
        />
      </g>
      <g id="Layer_2" />
    </svg>
  );
}

FlipCorner.defaultProps = { width: 50, height: 50 };

FlipCorner.propTypes = {};

export default FlipCorner;
