import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Star } from 'react-feather';
import { range } from 'd3';

const StarRating = ({ num = 5, highlighted = 0, onClick, disabled }) => (
  <div style={{ display: 'flex' }}>
    {range(1, num + 1).map(i => (
      <button
        disabled={disabled}
        onClick={() => onClick(i)}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        <Star size={50} fill={i <= highlighted ? 'gold' : 'white'} />
      </button>
    ))}
  </div>
);

export default StarRating;
