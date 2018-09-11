import React, { Fragment, Component } from 'react';

import ConnectedCard from 'Cards/ConnectedCard';
import DataOverlay from '../ForceOverlay/DataOverlay';
import Marker from '../Marker';
import CardMarker from 'Components/cards/CardMarker';

const CardViewOverlay = props => {
  const {
    onCardDrop,
    isCardDragging,
    width,
    height,
    cardSets,
    selectedTags,
    selectedCardId,
    filterSet,
    userLocation,
    dataView,
    changeMapViewport,
    tagColorScale,
    authEnv,
    extCardId,
    extendSelectedCard,
    createCard,
    toggleCardChallenge,
    onCardUpdate,
    cards,
    style,
    iOS,
    smallScreen,
    className,
    previewCardAction
  } = props;

  return (
    <DataOverlay
      className={className}
      style={style}
      disabled={isCardDragging}
      width={width}
      height={height}
      data={cards}
      sets={cardSets}
      selectedTags={selectedTags}
      selectedCardId={selectedCardId}
      extCardId={extCardId}
      filterSet={filterSet}
      userLocation={userLocation}
      mode={dataView}
      padding={{
        bottom: height / 5,
        top: height / 5,
        left: width / 5,
        right: width / 5
      }}
      colorScale={tagColorScale}
      preview={d => (
        <CardMarker
          style={{ pointerEvents: 'all' }}
          onClick={e => {
            console.log('pointerEvents');
            previewCardAction(d);
            e.stopPropagation();
          }}
          color="whitesmoke"
          style={{
            // TODO: zIndex not working
            zIndex: selectedCardId === d.id ? 5000 : 100,
            transform: selectedCardId === d.id && 'scale(2)'
          }}
        />
      )}
    >
      {c => <ConnectedCard {...c} />}
    </DataOverlay>
  );
};

export default CardViewOverlay;
