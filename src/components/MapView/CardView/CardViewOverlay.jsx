import React, { Fragment, Component } from 'react';

import PreviewMarker from 'Utils/PreviewMarker';
import ConnectedCard from 'Cards/ConnectedCard';
import DataOverlay from '../ForceOverlay/DataOverlay';

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
    onSubmitChallenge,
    iOS,
    smallScreen,
    className
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
        <PreviewMarker
          x={d.x}
          y={d.y}
          style={{ zIndex: selectedCardId === d.id ? 5000 : 100 }}
          selected={selectedCardId === d.id}
          template={d.template}
          color="whitesmoke"
        />
      )}
    >
      {c => <ConnectedCard {...c} />}
    </DataOverlay>
  );
};

export default CardViewOverlay;
