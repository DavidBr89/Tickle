import React from 'react';
import PropTypes from 'prop-types';

import { X, RotateCcw } from 'react-feather';

const CardControls = ({ onFlip, onClose, children, style, className }) => (
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
      className="ml-1"
      style={{
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <X size={30} />
    </div>
    {children}
    <div
      className="mr-1"
      onClick={onFlip}
      style={{
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <RotateCcw size={30} />
    </div>
  </div>
);

CardControls.defaultProps = { style: {} };

CardControls.propTypes = {};

export default CardControls;
