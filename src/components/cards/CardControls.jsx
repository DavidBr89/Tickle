import React from 'react';
import PropTypes from 'prop-types';

import { X, RotateCcw } from 'react-feather';

const CardControls = ({
  onFlip,
  onClose,
  children,
  style,
  className,
  size = 40,
  color = 'grey'
}) => (
  <div
    className={className}
    style={{
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
      marginTop: 'auto',
      justifyContent: 'space-between',
      ...style
    }}
  >
    <div
      onClick={onClose}
      className="m-1"
      style={{
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <X size={size} color={color} />
    </div>
    {children}
    <div
      className="m-1"
      onClick={onFlip}
      style={{
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <RotateCcw size={size} color={color} />
    </div>
  </div>
);

CardControls.defaultProps = { style: {}, children: null, className: '' };

CardControls.propTypes = {
  children: PropTypes.oneOf([null, PropTypes.node]),
  style: PropTypes.object,
  className: PropTypes.string
};

export default CardControls;
