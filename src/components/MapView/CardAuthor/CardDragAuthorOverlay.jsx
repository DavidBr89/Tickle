import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { PerspectiveMercatorViewport } from 'viewport-mercator-project';

import DimWrapper from 'Utils/DimensionsWrapper';
import ExtendableMarker from 'Utils/ExtendableMarker';

import CardPreviewMarker from '../PreviewMarker';

import {
  DragSourceCont,
  DropTargetCont,
  DragDropContextProvider
} from '../DragAndDrop/DragSourceTarget';

// import { dragCard } from 'Reducers/Cards/actions';
import { changeMapViewport } from 'Reducers/Map/actions';
import DataOverlay from '../ForceOverlay/DataOverlay';

import { colorScale } from 'Cards/styles';

import { Card } from 'Cards';

import { updateCardTemplate, dragCard } from 'Reducers/Cards/actions';

import {
  asyncUpdateCard,
  asyncCreateCard,
  asyncRemoveCard,
  asyncSubmitChallenge
} from 'Reducers/Cards/async_actions';

import * as dataViewActions from 'Reducers/DataView/actions';

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
    changeMapViewport,
    tagColorScale,
    authEnv,
    extendSelectedCard,
    extCardId,
    dragCard,
    createCard,
    toggleCardChallenge,
    onCardUpdate,
    cards,
    style,
    onSubmitChallenge,
    asyncRemoveCard
  } = props;
  return (
    <DropTargetCont
      dropHandler={onCardDrop}
      dragged={isCardDragging}
      style={style}
      colorScale={tagColorScale}
    >
      <DataOverlay
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
          <DragSourceCont
            dragHandler={dragCard}
            data={d}
            x={d.x}
            y={d.y}
            style={{ zIndex: selectedCardId === d.id ? 5000 : null }}
          >
            <CardPreviewMarker
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
            edit
            onSubmit={d => {
              console.log('onSubmit', { ...d, x, y });
              createCard({ ...d, x, y });
            }}
            onDelete={() => asyncRemoveCard(c.id)}
            onCollect={() =>
              toggleCardChallenge({
                cardChallengeOpen: true
              })
            }
            tagColorScale={tagColorScale}
            onUpdate={d => {
              console.log('ONUPDATE', { ...d, x, y });
              onCardUpdate({ ...d, x, y });
            }}
            onSubmitChallenge={onSubmitChallenge}
            uiColor="grey"
            background="whitesmoke"
            style={{ zIndex: 4000 }}
          />
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
  const { selectedCardId, mapViewport, width, height, authUser } = state;
  const { uid } = authUser;

  const { dataView } = ownProps;

  const {
    asyncUpdateCard,
    updateCardTemplate,
    asyncCreateCard,
    asyncRemoveCard,
    asyncSubmitChallenge
  } = dispatcherProps;

  const viewport = { ...mapViewport, width, height };

  // TODO: here bug,bugbugbugbugbugbug
  const onCardDrop = cardData => {
    // TODO: here bug,bugbugbugbugbugbug
    console.log('DROP update data', uid, dataView, cardData, viewport);
    return selectedCardId === 'temp'
      ? updateCardTemplate({ uid, cardData, viewport, dataView })
      : asyncUpdateCard({ cardData, viewport, dataView });
  };

  const createCard = cardData =>
    asyncCreateCard({ uid, cardData, viewport, dataView });

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
    createCard,
    onSubmitChallenge,
    ...ownProps
  };
};

const ConnectedCardAuthorOverlay = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(CardAuthorOverlay);

export default ConnectedCardAuthorOverlay;
