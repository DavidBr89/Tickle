import React from 'react';
import PropTypes from 'prop-types';
// const window = require('global/window');
import DIVOverlay from './div.react';

const UserMarker = props => {
  function redraw(opt) {
    const { longitude, latitude } = props.location;
    const { width, height } = props;
    const pixel = opt.project([longitude, latitude]);
    return (
      <i
        style={{
          transform: `translate(${pixel[0] + width / 2}px, ${pixel[1] +
            height / 2}px)`
        }}
        className="fa fa-street-view fa-2x"
        aria-hidden="true"
      />
    );
  }
  return <DIVOverlay {...props} redraw={redraw} />;
};

UserMarker.propTypes = {
  location: PropTypes.object.isRequired,
  width: PropTypes.number,
  height: PropTypes.number
};

UserMarker.defaultProps = {
  location: { latitude: 0, longitude: 0 },
  width: 26,
  height: 30
};

export default UserMarker;
