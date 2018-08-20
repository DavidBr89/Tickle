import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { PerspectiveMercatorViewport } from 'viewport-mercator-project';

import DimWrapper from 'Utils/DimensionsWrapper';
import ExtendableMarker from 'Utils/ExtendableMarker';

import CardPreviewMarker from 'Utils/PreviewMarker';

import {
  DragSourceCont,
  DropTargetCont,
  DragDropContextProvider
} from '../DragAndDrop/DragSourceTarget';

// import { dragCard } from 'Reducers/Cards/actions';
import DataOverlay from '../ForceOverlay/DataOverlay';

import EditCard from 'Components/cards/ConnectedEditCard';

import { updateCardTemplate, dragCard } from 'Reducers/Cards/actions';

import { asyncUpdateCard } from 'Reducers/Cards/async_actions';

// import { extendSelectedCard } from 'Reducers/DataView/actions';

const CardAuthorOverlay = DragDropContextProvider(props => {
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
    tagColorScale,
    authEnv,
    // extendSelectedCard,
    extCardId,
    dragCard,
    createCard,
    // toggleCardChallenge,
    onCardUpdate,
    cards,
    style,
    onSubmitChallenge,
    className
  } = props;
  return (
    <DropTargetCont
      dropHandler={onCardDrop}
      dragged={isCardDragging}
      style={style}
      colorScale={tagColorScale}
      className={className}
    >
      <DataOverlay
        className="mb-1"
        style={{ flex: '1 1 100%' }}
        author
        data={cards}
        disabled={isCardDragging}
        sets={cardSets}
        width={width}
        height={height}
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
          <DragSourceCont dragHandler={dragCard} data={d} x={d.x} y={d.y}>
            <CardPreviewMarker
              selected={selectedCardId === d.id}
              color="whitesmoke"
              style={{ zIndex: selectedCardId === d.id ? 5000 : 100 }}
            />
          </DragSourceCont>
        )}
      >
        {({ x, y, ...c }) => (
          <EditCard {...c} x={x} y={y} dataView={dataView} />
        )}
      </DataOverlay>
    </DropTargetCont>
  );
});

function mapStateToProps(state) {
  return {
    ...state.MapView,
    ...state.Cards,
    ...state.DataView,
    ...state.Screen,
    userLocation: state.MapView.userLocation,
    authUser: state.Session.authUser
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateCardTemplate,
      dragCard,
      asyncUpdateCard
    },
    dispatch
  );

const mergeProps = (state, dispatcherProps, ownProps) => {
  const { selectedCardId, mapViewport, width, height, authUser } = state;
  const { uid } = authUser;
  const { dataView } = ownProps;
  const { asyncUpdateCard, updateCardTemplate } = dispatcherProps;

  const viewport = { ...mapViewport, width, height };

  const onCardDrop = cardData => {
    console.log('cardData', cardData);
    selectedCardId === 'temp'
      ? updateCardTemplate({ uid, cardData, viewport, dataView })
      : asyncUpdateCard({ cardData, viewport, dataView });
  };

  return {
    ...state,
    ...dispatcherProps,
    onCardDrop,
    ...ownProps
  };
};

const ConnectedCardAuthorOverlay = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(CardAuthorOverlay);

export default ConnectedCardAuthorOverlay;
