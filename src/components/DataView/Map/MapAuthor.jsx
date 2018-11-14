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

const MapAuthor = DragDropContextProvider((props) => {
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

export default MapAuthor;
