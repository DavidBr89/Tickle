import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { PerspectiveMercatorViewport } from 'viewport-mercator-project';

import DimWrapper from 'Utils/DimensionsWrapper';
import ExtendableMarker from 'Utils/ExtendableMarker';

import PreviewMarker from './PreviewMarker';

import {
  DragSourceCont,
  DropTargetCont
  // DragDropContextProvider
} from './DragAndDrop/DragSourceTarget';

// import { dragCard } from 'Reducers/Cards/actions';
import { changeMapViewport } from 'Reducers/Map/actions';
import DataOverlay from './ForceOverlay/DataOverlay';

import { Card } from 'Cards';

import { updateCardTemplate, dragCard } from 'Reducers/Cards/actions';

import {
  asyncUpdateCard,
  asyncCreateCard,
  asyncRemoveCard,
  asyncSubmitChallenge
} from 'Reducers/Cards/async_actions';

import * as dataViewActions from 'Reducers/DataView/actions';

const CardDataOverlay = props => {
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
    extendSelectedCard,
    dragCard,
    cardAction,
    toggleCardChallenge,
    onCardUpdate,
    cards,
    style,
    onSubmitChallenge
  } = props;
  console.log('CardDataOverlay', props);
  return (
    <DropTargetCont
      dropHandler={onCardDrop}
      dragged={isCardDragging}
      style={style}
    >
      <DataOverlay
        disabled={isCardDragging}
        width={width}
        height={height}
        data={cards}
        sets={cardSets}
        selectedTags={selectedTags}
        selectedCardId={selectedCardId}
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
            <PreviewMarker
              selected={selectedCardId === d.id}
              template={d.template}
              color="whitesmoke"
            />
          </DragSourceCont>
        )}
      >
        {({ x, y, ...c }) => (
          <Card
            {...c}
            key={c.id}
            onClose={() => extendSelectedCard(null)}
            edit={authEnv}
            onSubmit={d => {
              cardAction({ ...d, x, y });
            }}
            onCollect={() =>
              toggleCardChallenge({
                cardChallengeOpen: true
              })
            }
            tagColorScale={tagColorScale}
            onUpdate={d => onCardUpdate({ ...d, x, y })}
            onSubmitChallenge={onSubmitChallenge}
            style={{ zIndex: 4000 }}
          />
        )}
      </DataOverlay>
    </DropTargetCont>
  );
};

function mapStateToProps(state) {
  return {
    ...state.MapView,
    ...state.Cards,
    ...state.DataView,
    userLocation: state.MapView.userLocation,
    ...state.Session
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      // dragCard,
      updateCardTemplate,
      ...dataViewActions,
      dragCard,
      asyncUpdateCard,
      asyncSubmitChallenge,
      asyncCreateCard,
      asyncRemoveCard,
      changeMapViewport
    },
    dispatch
  );

const mergeProps = (state, dispatcherProps, ownProps) => {
  const {
    selectedCardId,
    mapViewport,
    width,
    height,
    dataView,
    authUser
  } = state;
  const { uid } = authUser;

  const {
    asyncUpdateCard,
    updateCardTemplate,
    asyncCreateCard,
    asyncRemoveCard,
    asyncSubmitChallenge
  } = dispatcherProps;

  const viewport = { ...mapViewport, width, height };
  const onCardDrop = cardData =>
    selectedCardId === 'temp'
      ? updateCardTemplate({ uid, cardData, viewport, dataView })
      : asyncUpdateCard({ uid, cardData, viewport, dataView });

  const cardAction = cardData =>
    selectedCardId === 'temp'
      ? asyncCreateCard({ uid, cardData, viewport, dataView })
      : asyncRemoveCard({ uid, cid: cardData.id });

  const onCardUpdate = cardData =>
    selectedCardId === 'temp'
      ? updateCardTemplate({ cardData, viewport, dataView })
      : asyncUpdateCard({ uid, cardData, viewport, dataView });

  const onSubmitChallenge = challengeSubmission => {
    asyncSubmitChallenge({ playerId: uid, ...challengeSubmission });
  };
  // TODO: change

  return {
    ...state,
    ...dispatcherProps,
    onCardDrop,
    onCardUpdate,
    cardAction,
    onSubmitChallenge,
    ...ownProps
  };
};

const ConnectedCardDataOverlay = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(CardDataOverlay);

export default ConnectedCardDataOverlay;
