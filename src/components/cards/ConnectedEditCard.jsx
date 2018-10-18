import React from 'react';
import PropTypes from 'prop-types';
// import chroma from 'chroma-js';
import { compose } from 'recompose';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Card } from './index';
import { withRouter } from 'react-router-dom';

import { updateCardTemplate, dragCard } from 'Reducers/Cards/actions';

import { changeMapViewport } from 'Reducers/Map/actions';

import * as asyncCardActions from 'Reducers/Cards/async_actions';

import * as routeActions from 'Reducers/DataView/async_actions';

import { BigButton } from './layout';

import EditCardFront from './CardFront/EditCardFront';

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
      ...routeActions,
      dragCard,
      ...asyncCardActions,
      changeMapViewport,
      ...routeActions
    },
    dispatch
  );

const mergeProps = (state, dispatcherProps, ownProps) => {
  const {
    selectedCardId,
    mapViewport,
    width,
    height,
    authUser,
    tagVocabulary
  } = state;
  const { uid } = authUser;

  const { dataView, match, history, id } = ownProps;
  const { path } = match;

  const { flipped } = match.params;

  const {
    asyncUpdateCard,
    updateCardTemplate,
    asyncCreateCard,
    asyncRemoveCard,
    routeFlipCard
  } = dispatcherProps;

  const viewport = { ...mapViewport, width, height };

  // const onCardDrop = cardData => {
  //   console.log('CARD DROP', selectedCardId);
  //   selectedCardId === 'temp'
  //     ? updateCardTemplate({ uid, cardData, viewport, dataView })
  //     : asyncUpdateCardAttr({ cardData, viewport, dataView });
  // };

  const createCard = cardData =>
    asyncCreateCard({ uid, cardData, viewport, dataView });

  const onCardUpdate = cardData =>
    cardData.id === 'temp'
      ? updateCardTemplate(cardData)
      : asyncUpdateCard(cardData);

  const { routeExtendCard } = dispatcherProps;
  // TODO replace by regex

  const closeCard = () => {
    routeExtendCard({ path, history, id, extended: false });
  };
  const flipHandler = () => routeFlipCard({ match, history });

  return {
    ...state,
    ...dispatcherProps,
    onCardUpdate,
    createCard,
    closeCard,
    flipHandler,
    frontView: !flipped,
    tagVocabulary,
    ...ownProps
  };
};

const EditCard = ({
  extendSelectedCard,
  createCard,
  asyncRemoveCard,
  onCardUpdate,
  tagColorScale,
  x,
  y,
  closeCard,
  onChallengeClick,
  onCreate,
  template,
  ...props
}) => (
  <Card
    {...props}
    front={<EditCardFront {...props} />}
    key={props.id}
    onClose={closeCard}
    template={template}
    onCreate={d => {
      createCard({ ...d, x, y });
      closeCard();
    }}
    onUpdate={d => {
      onCardUpdate({ ...d, x, y });
    }}
    onDelete={() => {
      closeCard();
      asyncRemoveCard(props.id)
    }}
    tagColorScale={tagColorScale}
    uiColor="grey"
    background="whitesmoke"
    style={{ zIndex: 4000 }}
    edit
  />
);

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )
)(EditCard);
