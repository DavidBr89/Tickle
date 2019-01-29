import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import CardMarker from 'Src/components/cards/CardMarker';

import {dropTargetMap} from 'Src/components/DragAndDrop/DragTargetCont';
import DragDropContextProvider from 'Src/Components/DragAndDrop/DragContextProvider';
import DragElement from 'Src/components/DragAndDrop/DragElement';

import {PerspectiveMercatorViewport} from 'viewport-mercator-project';

import Map from 'Src/components/utils/Map';

const MapAuthor = DragDropContextProvider(props => {
  const {
    onCardDrop,
    isCardDragging,
    width,
    height,
    selectedCardId,
    cards,
    style,
    className,
    mapViewport,
    dragId
  } = props;

  const DropTarget = dropTargetMap[dragId];

  const vp = new PerspectiveMercatorViewport({
    ...mapViewport,
    width,
    height
  });

  const locNodes = cards.reduce((acc, n) => {
    console.log('node', n);
    const [x, y] = vp.project([
      n.loc.value.longitude,
      n.loc.value.latitude
    ]);
    if (x > 0 && x < width && y > 0 && y < height) {
      return [{...n, x, y}, ...acc];
    }
    return acc;
  }, []);

  const dragger = d =>
    selectedCardId === d.id ? (
      <DragElement {...d} className="drag" dragId={dragId}>
        <CardMarker
          style={{
            transform: 'scale(1.4)'
          }}
        />
      </DragElement>
    ) : (
      <CardMarker
        className="absolute drag"
        {...d}
        style={{
          transform: 'translate(-50%,-50%)',
          left: d.x,
          top: d.y
        }}
      />
    );

  return (
    <DropTarget
      key={dragId}
      dropHandler={onCardDrop}
      dragged={isCardDragging}
      className={className}
      style={style}>
      <Map {...props}>{locNodes.map(dragger)}</Map>
    </DropTarget>
  );
});

export default MapAuthor;
