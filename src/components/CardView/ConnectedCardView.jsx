// import React from 'react';
import WebMercatorViewport from 'viewport-mercator-project';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import { intersection } from 'lodash';
import { resizeCardWindow, userMove, changeViewport } from 'Reducers/Map/actions';

import setify from 'Utils/setify';
import distanceLoc from 'Components/utils/distanceLoc';
// rename path
import { screenResize } from 'Reducers/Screen/actions';
import * as cardActions from 'Reducers/Cards/actions';

import * as asyncActions from 'Reducers/Cards/async_actions';
import * as dataViewActions from 'Reducers/DataView/actions';
import * as dataViewAsyncActions from 'Reducers/DataView/async_actions';

import withAuthorization from 'Src/components/withAuthorization';
import withAuthentication from 'Src/components/withAuthentication';
import cardRoutes from 'Src/Routes/cardRoutes';

import { CHALLENGE_SUBMITTED, isChallengeSubmitted } from 'Constants/cardFields';

import CardViewPage from './CardViewPage';

// import mapViewReducer from './reducer';

const lowercase = s => s.toLowerCase();
const filterByTag = (doc, filterSet) => filterSet.length === 0
  || intersection(doc.tags.map(lowercase), filterSet.map(lowercase)).length
    === filterSet.length;

// const applyFilter = challengeState => d => {
//   if (challengeState === CHALLENGE_SUBMITTED) return isChallengeSubmitted(d);
//   return !isChallengeSubmitted(d);
// };

// Container
const mapStateToProps = (state) => {
  console.log('new Action', 'yeah');
  const { collectibleCards } = state.Cards;

  const {
    // selectedCardId,
    filterSet,
    cardPanelVisible
    // challengeStateFilter
  } = state.DataView;

  // TODO: own dim reducer
  const {
    width, height, userLocation, mapViewport
  } = state.MapView;

  // const { authEnv } = state.DataView;
  const {
    authUser: { uid }
  } = state.Session;

  // console.log('mercator', FlatMercatorViewport);
  const mercator = new WebMercatorViewport({ ...mapViewport });

  // TODO: make more specific
  return {
    ...state.MapView,
    ...state.DataView,
    uid,
    // selectedCardId,
    filterSet,
    collectibleCards,
    cardPanelVisible,
    ...state.Cards,
    ...state.Screen,
    mercator
    // cards: filteredCards
    // cardSets,
    // selectedTags,
    // tagColorScale
  };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    ...cardActions,
    ...asyncActions,
    ...dataViewActions,
    ...dataViewAsyncActions,
    resizeCardWindow,
    userMove,
    screenResize,
    changeViewport
  },
  dispatch,
);

// });

const mergeProps = (state, dispatcherProps, ownProps) => {
  const {
    uid,
    collectibleCards,
    filterSet,
    userLocation,
    accessibleRadius,
    mercator,
    width,
    height
  } = state;

  const { dataView, history, location } = ownProps;

  const {
    query: { selectedCardId, extended, flipped },
    routing: { routeSelectCard, routeExtendCard }
  } = cardRoutes({ history, location });


  const extCardId = extended ? selectedCardId : null;

  const extendedCard = extCardId !== null ? collectibleCards.find(c => c.id === extCardId) : null;

  // const selectedCardLocked = showOption === 'locked';

  // console.log('match', match);

  // const selectedCardId = selectedCardIds;
  const {
    selectCard,
    seeCard,
    // fetchAllCards,
    // fetchReadableCards,
    fetchCollectibleCards,
    ...otherActions
  } = dispatcherProps;

  const isInView = (loc) => {
    const coords = [loc.longitude, loc.latitude];
    const pos = mercator.project(coords);
    return pos[0] > 0 && pos[0] < width && pos[1] > 0 && pos[1] < height;
  };

  const previewCardAction = (d) => {
    if (selectedCardId === d.id) {
      return routeExtendCard();
    }
    return routeSelectCard(d.id);
  };


  const preSelectCardId = () => selectCard(null);

  // TODO: hack
  // const isInDistance = loc =>
  //   distanceLoc(userLocation, loc) < accessibleRadius / 2 + 1;

  const filteredCards = collectibleCards
    .filter(d => filterByTag(d, filterSet))
    .map((c) => {
      const visible = isInView(c.loc);
      const accessible = true; // visible;
      // (visible && isInDistance(c.loc)) || (isCardSeen(c) && visible);

      return { ...c, accessible };
    })
    .filter(d => d.accessible);

  console.log('filteredCards', filteredCards);
  // .filter(applyFilter(challengeStateFilter));

  const cardSets = setify(filteredCards);
  const selectedCard = filteredCards.find(d => d.id === selectedCardId) || null;

  const selectedTags = selectedCard !== null ? selectedCard.tags : filterSet;

  return {
    ...state,
    ...dispatcherProps,
    previewCardAction,
    routeSelectCard,
    // fetchCards,
    preSelectCardId,
    dataView,
    cards: filteredCards,
    cardSets,
    selectedTags,
    selectedCardId,
    // extCardId,
    // selectedCardLocked,
    extendedCard,
    selectedCard,
    ...ownProps
  };
};

const authCondition = authUser => authUser !== null;

export default compose(
  withRouter,
  withAuthentication,
  withAuthorization(authCondition),
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  ),
)(CardViewPage);
