import React from 'react';
import PropTypes from 'prop-types';

import CardMarker from 'Components/cards/CardMarker';

const Marker = ({ selectedCardId, onClick, ...c }) => (
  <div
    onClick={onClick}
    style={{
      // position: extended ? 'fixed' 'absolute',
      position: 'absolute',
      maxWidth: 500,
      width: 25,
      height: 30,
      left: c.x,
      top: c.y,
      // minWidth: 320,
      transform: 'translate(-50%, -50%)',
      zIndex: selectedCardId === c.id && 4000
      // zIndex: extended && 4000,
      // transition: `transform ${delay}ms, left ${delay}ms, top ${delay}ms, width ${delay}ms, height ${delay}ms`,
    }}
  >
    <CardMarker
      key={c.id}
      delay={100}
      style={{
        width: 25,
        height: 30,
        pointerEvents: 'all',
        transition: 'transform 1s, left 300ms, top 300ms',
        transform: selectedCardId === c.id && 'scale(2)'
        // zIndex: selectedCardId === c.id && 4000
      }}
    />
  </div>
);

Marker.defaultProps = {};

Marker.propTypes = {};

export default Marker;
