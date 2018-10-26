import React from 'react';
import PropTypes from 'prop-types';

import closeSrc from './close.svg';

function CloseIcon({width = 25, height = 25, ...props}) {
  return (
    <div {...props} className="flex-col-wrapper items-center cursor-pointer">
      <img src={closeSrc} width={width} height={height} />
    </div>
  );
}

CloseIcon.defaultProps = {};

CloseIcon.propTypes = {};

export {CloseIcon};
