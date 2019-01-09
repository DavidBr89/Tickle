import React from 'react';
import PropTypes from 'prop-types';
import cx from './Flipper.scss';

const Flipper = ({flipped, front, back, frontClassName, backClassName}) => (
  <div className={`${cx.flipContainer} ${flipped && cx.flip}`}>
    <div className={`${cx.flipper} ${flipped && cx.flip}`}>
      <div
        className={`${cx.front} ${frontClassName}`}
        style={{pointerEvents: flipped ? 'none' : null}}
      >
        {front}
      </div>
      <div
        className={`${cx.back} ${backClassName}`}
        style={{
          pointerEvents: !flipped ? 'none' : null,
        }}>
        {back}
      </div>
    </div>
  </div>
);

Flipper.defaultProps = {
  flipped: false,
  front: null,
  back: null,
  frontClassName: '',
  backClassName: ''
};

Flipper.propTypes = {
  flipped: PropTypes.bool,
  front: PropTypes.oneOf([null, PropTypes.node]),
  back: PropTypes.oneOf([null, PropTypes.node]),
  frontClassName: PropTypes.string,
  backClassName: PropTypes.string
};

export default Flipper;
