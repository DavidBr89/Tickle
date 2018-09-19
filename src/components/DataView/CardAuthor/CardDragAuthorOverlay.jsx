import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CardMarker from 'Components/cards/CardMarker';

import { Modal, BareModal, ModalBody } from 'Utils/Modal';

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
import { selectCard } from 'Reducers/DataView/actions';

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
    className,
    selectCard,
    previewCardAction
  } = props;

  const DragPreviewCard = ({ ...d }) => {
    const selected = selectedCardId === d.id;

    return (
      <DragSourceCont
        dragHandler={dragCard}
        data={d}
        x={d.x}
        y={d.y}
        width={80}
        height={80}
        selected={selected}
      >
        <div
          onMouseDown={() => dragCard(true)}
          onClick={e => {
            previewCardAction(d);
            e.stopPropagation();
            dragCard(false);
          }}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: selected && '2px dashed black',
            borderRadius: '10%'
          }}
        >
          <CardMarker
            color="whitesmoke"
            selected={selected}
            style={{
              width: 25,
              height: 30
            }}
          />
        </div>
      </DragSourceCont>
    );
  };

  console.log('extCardId', extCardId);

  const draggable = c => (
    <div
      style={{
        position: 'absolute',
        left: c.x,
        top: c.y,
        transform: 'translate(-50%, -50%)',
        zIndex: selectedCardId === c.id ? 10 : 0
      }}
    >
      {DragPreviewCard(c)}
    </div>
  );

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
        style={style}
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
        draggable={draggable}
      >
        {c =>
          extCardId === c.id ? (
            <BareModal visible>
              <EditCard {...c} dataView={dataView} />
            </BareModal>
          ) : (
            draggable(c)
          )
        }
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
      asyncUpdateCard,
      selectCard
    },
    dispatch
  );

const mergeProps = (state, dispatcherProps, ownProps) => {
  const { mapViewport, width, height, authUser } = state;
  const { uid } = authUser;
  const { dataView, selectedCardId } = ownProps;
  const { asyncUpdateCard, updateCardTemplate } = dispatcherProps;

  const viewport = { ...mapViewport, width, height };

  const onCardDrop = cardData => {
    if (selectedCardId === cardData.id) {
      if (cardData.id === 'temp')
        updateCardTemplate({ uid, cardData, viewport, dataView });
      else asyncUpdateCard({ cardData, viewport, dataView });
    }
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
