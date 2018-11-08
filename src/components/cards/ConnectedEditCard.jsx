import React from 'react';
import PropTypes from 'prop-types';
// import chroma from 'chroma-js';
import { compose } from 'recompose';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';

import { DB } from 'Firebase';

import { updateCardTemplate, dragCard } from 'Reducers/Cards/actions';

import { changeMapViewport } from 'Reducers/Map/actions';

import * as asyncCardActions from 'Reducers/Cards/async_actions';

import * as routeActions from 'Reducers/DataView/async_actions';

import cardRoutes from 'Src/Routes/cardRoutes';
import EditCardFront from './CardFront/EditCardFront';

import CardBack from './CardBack';

import CardFrame from './CardFrame';

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
  {
    // dragCard,
    updateCardTemplate,
    ...routeActions,
    dragCard,
    ...asyncCardActions,
    changeMapViewport,
    ...routeActions
  },
  dispatch,
);

const mergeProps = (state, dispatcherProps, ownProps) => {
  const {
    mapViewport, width, height, authUser, tagVocabulary
  } = state;
  // const {uid} = authUser;
  const {
    match, location, history, uid, id: cardId
  } = ownProps;

  const { userEnv } = match.params;

  const {
    query: { selectedCardId, extended, flipped },
    routing: { routeFlipCard, routeExtendCard }
  } = cardRoutes({ history, location });

  const {
    updateCardTemplate,
    asyncCreateCard,
    asyncUpdateCard,
    asyncRemoveCard
  } = dispatcherProps;

  const createCard = (cardData) => {
    asyncCreateCard({ cardData, userEnv });
  };
  const updateCard = (cardData) => {
    asyncUpdateCard({ cardData, userEnv });
  };

  const removeCard = id => asyncRemoveCard({ cardId: id, userEnv });

  const onCardUpdate = cardData => (cardData.id === 'temp'
    ? updateCardTemplate(cardData)
    : updateCard(cardData));

  const db = DB(userEnv);
  const fetchComments = cardId ? () => db.readComments(cardId) : null;
  const addComment = text => db.addComment({ uid, cardId, text });
  const fetchAuthorData = () => {
    console.log('ownProps', ownProps, 'state', state);

    return db.getDetailedUserInfo(uid);
  };

  const onClose = routeExtendCard;

  const onFlip = routeFlipCard;

  return {
    ...state,
    ...dispatcherProps,
    onCardUpdate,
    createCard,
    onClose,
    onFlip,
    flipped,
    removeCard,
    tagVocabulary,
    fetchComments,
    addComment,
    fetchAuthorData,
    ...ownProps
  };
};

const EditCard = ({
  createCard,
  removeCard,
  onCardUpdate,
  x,
  y,
  onClose,
  flipped,
  onChallengeClick,
  onCreate,
  template,
  onFlip,
  fetchAuthorData, id,
  ...props
}) => (
  <CardFrame
    key={id}
    flipped={flipped}
    front={
      <EditCardFront
        {...props}
        id={id}
        template={template}
        onClose={onClose}
        onFlip={onFlip}
        onCreate={(d) => {
          createCard({ ...d, x, y });
          onClose();
        }}
        onUpdate={(d) => {
          onCardUpdate({ ...d, x, y });
        }}
      />
    }
    back={
      <CardBack
        {...props}
        id={id}
        onClose={onClose}
        fetchAuthorData={fetchAuthorData}
        onFlip={onFlip}
        edit
        onDelete={() => {
          onClose();
          removeCard(props.id);
        }}
      />
    }
  />
);

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  ),
)(EditCard);
