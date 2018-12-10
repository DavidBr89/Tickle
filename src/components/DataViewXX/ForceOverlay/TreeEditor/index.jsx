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
import { makeTagColorScale } from 'Src/styles/GlobalThemeContext'; // eslint-disable-line
import { screenResize } from 'Reducers/Screen/actions';
import * as cardActions from 'Reducers/Cards/actions';
import * as asyncActions from 'Reducers/Cards/async_actions';
import * as dataViewActions from 'Reducers/DataView/actions';
// TODO: refactor these actions
import * as routeActions from 'Reducers/DataView/async_actions';

// import { fetchDirection } from 'Reducers/Map/async_actions';

import CardAuthorPage from './CardAuthorPage';

import withAuthorization from 'Src/components/withAuthorization';

// import mapViewReducer from './reducer';

// Container
const mapStateToProps = state => {
  // const { createdCards, tmpCard } = state.Cards;
  //
  // const { selectedCardId, filterSet } = state.DataView;
  // // console.log('selectedCardid', selectedCardId);
  //
  // // TODO: own dim reducer
  // const { width, height, userLocation } = state.MapView;
  //
  // // const { authEnv } = state.DataView;
  // const {
  //   authUser: { uid, admin }
  // } = state.Session;
  //
  // console.log('userLocation', userLocation);
  // const templateCard = {
  //   loc: userLocation,
  //   ...tmpCard,
  //   uid
  // };
  //
  // const filteredCards = createdCards.filter(
  //   d =>
  //     filterSet.length === 0 ||
  //     intersection(d.tags, filterSet).length === filterSet.length
  // );
  //
  // const cards = [templateCard, ...filteredCards];
  //
  // const cardSets = setify(cards);
  //
  // // const tagColorScale = makeTagColorScale(cardSets);
  //
  // // TODO: outsource action
  // // TODO: outsource action
  // // TODO: outsource action
  // // TODO: outsource action
  // const selectedCard = cards.find(d => d.id === selectedCardId) || null;
  //
  // const selectedTags = selectedCard !== null ? selectedCard.tags : filterSet;

  return {
    // ...state.MapView,
    // ...state.DataView,
    ...state.Cards,
    ...state.Screen,
    // uid,
    // admin,
    // selectedCardId,
    // filterSet,
    // templateCard,
    // cardSets,
    // cards,
    // selectedTags, selectedCard
    // tagColorScale
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...cardActions,
      ...asyncActions,
      ...dataViewActions,
      ...routeActions,
      resizeCardWindow,
      // userMove,
      // screenResize,
      // changeMapViewport,
      // userMove
    },
    dispatch
  );

// });

const mergeProps = (state, dispatcherProps, ownProps) => {
  return {
    ...state,
    ...dispatcherProps,
    // previewCardAction,
    // fetchCards,
    // preSelectCardId,
    // dataView,
    // selectedCardId,
    // extCardId,
  };
};

// TODO: change Later
// TODO: change Later
// TODO: change Later
// TODO: change Later
// TODO: change Later
const authCondition = authUser => authUser !== null;

export default compose(
  withAuthorization(authCondition),
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )
)(CardAuthorPage);
