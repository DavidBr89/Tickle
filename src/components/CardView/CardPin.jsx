import React from 'react';

import CardMarker from 'Components/cards/CardMarker';

const CardPin = ({ selected, ...d }) => (
  <CardMarker
    onClick={e => {
      e.stopPropagation();
      // previewCardAction(d);
    }}
    color="whitesmoke"
    style={{
      position: 'absolute',
      left: d.x,
      top: d.y,
      transform: 'translate(-50%, -50%)',
      // TODO: zIndex not working
      width: selected ? 40 : 25,
      height: selected ? 50 : 30,
      zIndex: selected ? 1 : 0
      // transition: 'width 300ms, height 300ms'
      // transform: selectedCardId === d.id && 'scale(2)'
    }}
  />
);

export default CardPin;
