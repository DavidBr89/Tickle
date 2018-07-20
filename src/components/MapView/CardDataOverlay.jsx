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
    <div style={style}>
      <DataOverlay
        {...props}
        padding={{
          bottom: height / 5,
          top: height / 5,
          left: width / 5,
          right: width / 5
        }}
        preview={d => (
          <PreviewMarker
            x={d.x}
            y={d.y}
            style={{ zIndex: selectedCardId === d.id ? 5000 : null }}
            selected={selectedCardId === d.id}
            template={d.template}
            color="whitesmoke"
          />
        )}
      >
        {({ x, y, ...c }) => (
          <Card
            {...c}
            key={c.id}
            edit={false}
            onClose={() => extendSelectedCard(null)}
            onCollect={() =>
              toggleCardChallenge({
                cardChallengeOpen: true
              })
            }
            tagColorScale={tagColorScale}
            onSubmitChallenge={onSubmitChallenge}
            uiColor="grey"
            background="whitesmoke"
            style={{ zIndex: 4000 }}
          />
        )}
      </DataOverlay>
    </div>
  );
};

function mapStateToProps(state) {
  console.log('State Screen', state.Screen);
  return {
    ...state.MapView,
    ...state.Cards,
    ...state.DataView,
    userLocation: state.MapView.userLocation,
    ...state.Session,
    ...state.Screen
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      // dragCard,
      ...dataViewActions,
      asyncSubmitChallenge,
      changeMapViewport
    },
    dispatch
  );

const mergeProps = (state, dispatcherProps, ownProps) => {
  const { authUser } = state;
  const { uid } = authUser;

  const onSubmitChallenge = challengeSubmission => {
    asyncSubmitChallenge({ playerId: uid, ...challengeSubmission });
  };

  return {
    ...state,
    ...dispatcherProps,
    onSubmitChallenge,
    ...ownProps
  };
};

const ConnectedCardViewDataOverlay = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(CardDataOverlay);

export default ConnectedCardViewDataOverlay;
