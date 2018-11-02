import React from 'react';
import PropTypes from 'prop-types';
// import chroma from 'chroma-js';
import {compose} from 'recompose';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import CardFrame from './CardFrame';
import {withRouter} from 'react-router-dom';

import {DB} from 'Firebase';

import {updateCardTemplate, dragCard} from 'Reducers/Cards/actions';

import {changeMapViewport} from 'Reducers/Map/actions';

import * as asyncCardActions from 'Reducers/Cards/async_actions';

import * as routeActions from 'Reducers/DataView/async_actions';

import EditCardFront from './CardFront/EditCardFront';

import CardBack from './CardBack';

import cardRoutes from 'Src/Routes/cardRoutes';

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
    dispatch,
  );

const mergeProps = (state, dispatcherProps, ownProps) => {
  const {mapViewport, width, height, authUser, tagVocabulary} = state;
  // const {uid} = authUser;
  const {match, location, history, uid} = ownProps;
  console.log('ownProps CARD', ownProps);

  const {userEnv} = match.params;

  const {
    query: {selectedCardId, extended, flipped},
    routing: {routeFlipCard, routeExtendCard}
  } = cardRoutes({history, location});

  const {
    asyncUpdateCard,
    updateCardTemplate,
    asyncCreateCard,
    asyncRemoveCard,
  } = dispatcherProps;

  const createCard = cardData => {
    console.log('yo', cardData, userEnv);
    asyncCreateCard({cardData, userEnv});
  };

  const onCardUpdate = cardData =>
    cardData.id === 'temp'
      ? updateCardTemplate(cardData)
      : createCard(cardData);

  const onClose = routeExtendCard;

  const onFlip = routeFlipCard;
  const db = DB(userEnv);
  const fetchAuthorData = () => db.getDetailedUserInfo(uid);

  return {
    ...state,
    ...dispatcherProps,
    onCardUpdate,
    createCard,
    onClose,
    onFlip,
    flipped,
    tagVocabulary,
    fetchAuthorData,
    ...ownProps
  };
};

const EditCard = ({
  createCard,
  asyncRemoveCard,
  onCardUpdate,
  x,
  y,
  onClose,
  flipped,
  onChallengeClick,
  onCreate,
  template,
  onFlip,
  fetchAuthorData,
  ...props
}) => (
  <CardFrame
    key={props.id}
    flipped={flipped}
    front={
      <EditCardFront
        {...props}
        template={template}
        onClose={onClose}
        onFlip={onFlip}
        onCreate={d => {
          createCard({...d, x, y});
          onClose();
        }}
        onUpdate={d => {
          onCardUpdate({...d, x, y});
        }}
      />
    }
    back={
      <CardBack
        {...props}
        onClose={onClose}
        fetchAuthorData={fetchAuthorData}
        onFlip={onFlip}
        edit
        onDelete={() => {
          onClose();
          asyncRemoveCard(props.id);
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
