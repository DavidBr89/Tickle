import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CardMarker from 'Components/cards/CardMarker';

import DropTargetCont from '../DragAndDrop/DragTargetCont';

import DragDropContextProvider from '../DragAndDrop/DragContextProvider';

// import { dragCard } from 'Reducers/Cards/actions';
import DataOverlay from '../ForceOverlay/DataOverlay';

import { updateCardTemplate, dragCard } from 'Reducers/Cards/actions';

import { asyncUpdateCard } from 'Reducers/Cards/async_actions';
import { selectCard } from 'Reducers/DataView/actions';

import DragElement from '../DragAndDrop/DragElement';

import Map from '../ForceOverlay/Map';
import TopicMap from '../ForceOverlay/TopicMap/AuthorTopicMap';

import { GEO, TAGS, FLOORPLAN } from 'Constants/dataViews';

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
    // dragCard,
    createCard,
    // toggleCardChallenge,
    onCardUpdate,
    cards,
    style,
    onSubmitChallenge,
    className,
    selectCard,
    previewCardAction,
    routeSelectCard
  } = props;

  const dragger = d =>
    selectedCardId === d.id ? (
      <DragElement {...d} className="drag">
        <CardMarker
          style={{
            transform: 'scale(1.4)'
            // transition: 'transform 500ms'
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
          top: d.y
        }}
      />
    );

  const selectComp = () => {
    switch (dataView) {
      case GEO:
        return (
          <Map
            width={width}
            height={height}
            preview={d => routeSelectCard(d.id)}
            nodes={cards}
            routeSelectCard={routeSelectCard}
          >
            {dragger}
          </Map>
        );
      case FLOORPLAN:
        return (
          <TopicMap {...props} width={width} height={height} data={cards} zoom>
            {dragger}
          </TopicMap>
        );
      default:
        return null;
    }
  };

  return (
    <DropTargetCont
      dropHandler={onCardDrop}
      dragged={isCardDragging}
      style={style}
      className={className}
    >

          <Map
            width={width}
            height={height}
            preview={d => routeSelectCard(d.id)}
            nodes={cards}
            routeSelectCard={routeSelectCard}
          >
            {dragger}
          </Map>

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
      // dragCard,
      asyncUpdateCard,
      selectCard
    },
    dispatch
  );

const mergeProps = (state, dispatcherProps, ownProps) => {
  const { mapViewport, width, height, authUser } = state;
  const { dataView, selectedCardId } = ownProps;
  const { asyncUpdateCard, updateCardTemplate } = dispatcherProps;

  const viewport = { ...mapViewport, width, height };

  const onCardDrop = cardData => {
    if (cardData.id === 'temp')
      updateCardTemplate({ cardData, viewport, dataView });
    else asyncUpdateCard({ cardData, viewport, dataView });
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
