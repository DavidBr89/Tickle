import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CardMarker from 'Components/cards/CardMarker';

import DropTargetCont from 'Components/DataView/DragAndDrop/DragTargetCont';

import DragDropContextProvider from 'Components/DataView/DragAndDrop/DragContextProvider';

import {
  PerspectiveMercatorViewport
} from 'viewport-mercator-project';


import { updateCardTemplate } from 'Reducers/Cards/actions';

import { asyncUpdateCard } from 'Reducers/Cards/async_actions';

import DragElement from 'Components/DataView/DragAndDrop/DragElement';

import Map from 'Components/DataView/ForceOverlay/Map';

function updCardLoc({ x, y }, mapViewport) {
  const vp = new PerspectiveMercatorViewport(mapViewport);

  const [longitude, latitude] = vp.unproject([
    x, // || mapViewport.width / 2,
    y // || mapViewport.height / 2
  ]);
  return { latitude, longitude };
}

const CardAuthorOverlay = DragDropContextProvider((props) => {
  const {
    onCardDrop,
    isCardDragging,
    width,
    height,
    selectedCardId,
    cards,
    style,
    onSubmitChallenge,
    className,
    previewCardAction,
    routeSelectCard
  } = props;

  const dragger = d => (selectedCardId === d.id ? (
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
  ));

  // const selectComp = () => {
  //   switch (dataView) {
  //     case GEO:
  //       return (
  //         <Map
  //           width={width}
  //           height={height}
  //           preview={d => routeSelectCard(d.id)}
  //           nodes={cards}
  //           routeSelectCard={routeSelectCard}
  //         >
  //           {dragger}
  //         </Map>
  //       );
  //     case FLOORPLAN:
  //       return (
  //         <TopicMap {...props} width={width} height={height} data={cards} zoom>
  //           {dragger}
  //         </TopicMap>
  //       );
  //     default:
  //       return null;
  //   }
  // };

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

const mapDispatchToProps = dispatch => bindActionCreators(
  { updateCardTemplate, asyncUpdateCard }, dispatch);

const mergeProps = (state, dispatcherProps, ownProps) => {
  const {
    mapViewport, width, height, authUser
  } = state;
  const { dataView, selectedCardId } = ownProps;
  const { asyncUpdateCard, updateCardTemplate } = dispatcherProps;

  const viewport = { ...mapViewport, width, height };

  const onCardDrop = (cardData) => {
    console.log('card drop data', cardData);
    const { x, y } = cardData;
    const loc = updCardLoc({ x, y }, viewport);
    const updatedCard = { ...cardData, loc };
    // TODO: fix user env
    if (cardData.id === 'temp') updateCardTemplate(updatedCard);
    else asyncUpdateCard({ cardData: updatedCard, userEnv: 'staging' });
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
