import React from 'react';
import PropTypes from 'prop-types';

import Flipper from 'Components/utils/Flipper';

export default function CardFrame({...props}) {
  const className = 'bg-white border-4 border-black flex flex-col';
  return (
    <Flipper frontClassName={className} backClassName={className} {...props} />
  );
}
