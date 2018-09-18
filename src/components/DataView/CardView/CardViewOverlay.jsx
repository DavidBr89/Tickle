import React, { Fragment, Component } from 'react';

import ConnectedCard from 'Cards/ConnectedCard';
import DataOverlay from '../ForceOverlay/DataOverlay';
// TODO integrate
import Marker from '../Marker';
import CardMarker from 'Components/cards/CardMarker';

import { Modal, BareModal, ModalBody } from 'Utils/Modal';

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
    previewCardAction,
    selectedCardLocked,
    routeSelectCard
  } = props;

  return (
    <React.Fragment>
      <Modal visible={selectedCardLocked}>
        <ModalBody
          onClose={() => {
            routeSelectCard(selectedCardId);
          }}
        >
          <div className="jumbotron">
            <h1>Card is locked</h1>
            <p>
              The card is not accessible! Please move closer to the exact
              location of the card
            </p>
          </div>
        </ModalBody>
      </Modal>

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
        showUserLocation
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
              previewCardAction(d);
              e.stopPropagation();
            }}
            color="whitesmoke"
            style={{
              // TODO: zIndex not working
              width: 25,
              height: 30,
              zIndex: selectedCardId === d.id ? 5000 : 0,
              transform: selectedCardId === d.id && 'scale(2)'
            }}
          />
        )}
      >
        {c => <ConnectedCard {...c} />}
      </DataOverlay>
    </React.Fragment>
  );
};

export default CardViewOverlay;
