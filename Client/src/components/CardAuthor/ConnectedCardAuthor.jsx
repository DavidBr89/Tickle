// import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import { intersection } from 'lodash';

import {
  resizeCardWindow,
  userMove,
  changeMapViewport
} from 'Reducers/Map/actions';

import setify from 'Utils/setify'; // eslint-disable-line
import { screenResize } from 'Reducers/Screen/actions';
import * as cardActions from 'Reducers/Cards/actions';
import * as asyncActions from 'Reducers/Cards/async_actions';
import * as dataViewActions from 'Reducers/DataView/actions';
// TODO: refactor these actions
import * as routeActions from 'Reducers/DataView/async_actions';

import cardRoutes from 'Src/Routes/cardRoutes';


import withAuthorization from 'Src/components/withAuthorization';
import withAuthentication from 'Src/components/withAuthentication';
import CardAuthorPage from './CardAuthorPage';

// import mapViewReducer from './reducer';

// Container
const mapStateToProps = (state) => {
  const { createdCards, tmpCard } = state.Cards;

  const { filterSet } = state.DataView;
  // console.log('selectedCardid', selectedCardId);

  // TODO: own dim reducer
  const { width, height, userLocation } = state.MapView;

  // const { authEnv } = state.DataView;
  const {
    authUser: { uid, admin }
  } = state.Session;

  const templateCard = {
    loc: userLocation,
    uid,
    id: 'temp',
    ...tmpCard
  };

  const filteredCards = createdCards.filter(
    d => filterSet.length === 0
      || intersection(d.tags, filterSet).length === filterSet.length,
  );

  const cards = [templateCard, ...filteredCards];

  return {
    ...state.MapView,
    ...state.DataView,
    ...state.Cards,
    ...state.Screen,
    uid,
    admin,
    filterSet,
    templateCard,
    cards
    // tagColorScale
  };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    ...cardActions,
    ...asyncActions,
    ...dataViewActions,
    ...routeActions,
    resizeCardWindow,
    screenResize,
    changeMapViewport,
    userMove
  },
  dispatch,
);

// });

const mergeProps = (state, dispatcherProps, ownProps) => {
  const {
    uid, admin, templateCard, createdCards, cards, filterSet
  } = state;


  const {
    dataView, history, location, children
  } = ownProps;

  const {
    query: { selectedCardId, extended },
    routing: { routeSelectCard, routeExtendCard }
  } = cardRoutes({ history, location });

  const extCardId = extended ? selectedCardId : null;

  const cardSets = setify(cards);

  const selectedCard = cards.find(d => d.id === selectedCardId) || null;

  const selectedTags = selectedCard !== null ? selectedCard.tags : filterSet;

  const previewCardAction = (d) => {
    selectedCardId === d.id ? routeExtendCard() : routeSelectCard(d.id);
  };

  return {
    ...state,
    ...dispatcherProps,
    previewCardAction,
    cardSets,
    selectedCard,
    selectedTags,
    dataView,
    selectedCardId,
    extCardId,
    children
  };
};

// TODO: change Later
// TODO: change Later
// TODO: change Later
// TODO: change Later
// TODO: change Later
const authCondition = authUser => authUser !== null;

export default compose(
  withAuthentication,
  withAuthorization(authCondition),
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  ),
)(CardAuthorPage);