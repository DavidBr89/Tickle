import React from 'react';
import PropTypes from 'prop-types';
import chroma from 'chroma-js';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Card } from './index';

import { updateCardTemplate, dragCard } from 'Reducers/Cards/actions';

import { changeMapViewport } from 'Reducers/Map/actions';

import {
  asyncUpdateCard,
  asyncCreateCard,
  asyncRemoveCard,
  asyncSubmitChallenge
} from 'Reducers/Cards/async_actions';

import * as dataViewActions from 'Reducers/DataView/actions';

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

  // const onCardDrop = cardData => {
  //   console.log('CARD DROP', selectedCardId);
  //   selectedCardId === 'temp'
  //     ? updateCardTemplate({ uid, cardData, viewport, dataView })
  //     : asyncUpdateCard({ cardData, viewport, dataView });
  // };

  const createCard = cardData =>
    asyncCreateCard({ uid, cardData, viewport, dataView });

  const onCardUpdate = cardData =>
    selectedCardId === 'temp'
      ? updateCardTemplate({ cardData, viewport, dataView })
      : asyncUpdateCard({ uid, cardData, viewport, dataView });

  const onSubmitChallenge = challengeSubmission => {
    asyncSubmitChallenge({ playerId: uid, ...challengeSubmission });
  };

  return {
    ...state,
    ...dispatcherProps,
    onCardUpdate,
    createCard,
    onSubmitChallenge,
    ...ownProps
  };
};

const EditCard = ({
  extendSelectedCard,
  createCard,
  asyncRemoveCard,
  onCardUpdate,
  onSubmitChallenge,
  tagColorScale,
  x,
  y,
  ...props
}) => (
  <Card
    {...props}
    key={props.id}
    onClose={() => extendSelectedCard(null)}
    edit
    onSubmit={d => {
      createCard({ ...d, x, y });
    }}
    onDelete={() => asyncRemoveCard(props.id)}
    tagColorScale={tagColorScale}
    onUpdate={d => {
      onCardUpdate({ ...d, x, y });
    }}
    onSubmitChallenge={onSubmitChallenge}
    uiColor="grey"
    background="whitesmoke"
    style={{ zIndex: 4000 }}
  />
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(EditCard);
