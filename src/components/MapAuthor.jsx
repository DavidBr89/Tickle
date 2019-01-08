import React from 'react';
import PropTypes from 'prop-types';

import CardMarker from 'Components/cards/CardMarker';

import {dropTargetMap} from 'Components/DragAndDrop/DragTargetCont';
import DragDropContextProvider from 'Components/DragAndDrop/DragContextProvider';
import DragElement from 'Components/DragAndDrop/DragElement';

import {PerspectiveMercatorViewport} from 'viewport-mercator-project';

import Map from 'Components/utils/Map';

// const DropTarget = dropTarget('dragSourceCard');
// const memDropTarget = memoize(dropTarget);

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
    dragId,
  } = props;

  const DropTarget = dropTargetMap[dragId];

  const vp = new PerspectiveMercatorViewport({...mapViewport, width, height});

  const locNodes = cards.reduce((acc, n) => {
    const [x, y] = vp.project([n.loc.longitude, n.loc.latitude]);
    if (x > 0 && x < width && y > 0 && y < height) {
      return [{...n, x, y}, ...acc];
    }
    return acc;
  }, []);

  const dragger = d =>
    selectedCardId === d.id ? (
      <DragElement
        {...d}
        key={`${d.id}${dragId}`}
        className="drag"
        dragId={dragId}>
        <CardMarker
          style={{
            transform: 'scale(1.4)',
          }}
        />
      </DragElement>
    ) : (
      <CardMarker
        className="drag"
        {...d}
        style={{
          position: 'absolute',
          transform: 'translate(-50%,-50%)',
          left: d.x,
          top: d.y,
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
