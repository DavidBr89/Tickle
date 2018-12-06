import React, {Component} from 'react';
// import PropTypes from 'prop-types';

import Star from 'react-feather/dist/icons/star';
import {range} from 'd3';

const Rating = ({
  num = 5,
  numHighlighted = 0,
  onClick = d => d,
  disabled,
  children,
}) => (
  <div style={{display: 'flex'}}>
    {range(1, num + 1).map(i => (
      <button
        disabled={disabled}
        onClick={() => onClick(i)}
        style={{cursor: 'pointer', display: 'flex', alignItems: 'center'}}>
        {children(i <= numHighlighted, i)}
      </button>
    ))}
  </div>
);

export const StarRating = ({...props}) => (
  <Rating {...props}>
    {on => <Star size={30} fill={on ? 'gold' : 'white'} />}
  </Rating>
);

export default Rating;
