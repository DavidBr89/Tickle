import React from 'react';
import PropTypes from 'prop-types';
import cx from './Flipper.scss';

const Flipper = ({flipped, front, back}) => (
  <div className={`${cx.flipContainer} ${flipped && cx.flip}`}>
    <div className={`${cx.flipper} ${flipped && cx.flip}`}>
      <div className={cx.front}>{front}</div>
      <div className={cx.back}>{back}</div>
    </div>
  </div>
);

Flipper.defaultProps = {flipped: false, front: null, back: null};

Flipper.propTypes = {
  flipped: PropTypes.bool,
  front: PropTypes.oneOf([null, PropTypes.node]),
  back: PropTypes.oneOf([null, PropTypes.node])
};

export default Flipper;
