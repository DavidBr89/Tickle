import React from 'react';
import PropTypes from 'prop-types';

import { X, RotateCcw } from 'react-feather';
import CloseCorner from './CloseCorner';
import FlipCorner from './FlipCorner';

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
      alignItems: 'flex-end',
      flexShrink: 0,
      marginTop: 'auto',
      justifyContent: 'space-between',
      ...style
    }}
  >
    <div
      onClick={onClose}
      style={{
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer'
      }}
    >
      <CloseCorner width={70} height={70} />
    </div>
    {children}
    <div
      onClick={onFlip}
      style={{
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer'
      }}
    >
      <FlipCorner width={70} height={70} />
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
