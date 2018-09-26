// import React from 'react';
import WebMercatorViewport from 'viewport-mercator-project';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import { intersection } from 'lodash';
import {
  resizeCardWindow,
  userMove,
  changeViewport
} from 'Reducers/Map/actions';

import setify from 'Utils/setify';
import distanceLoc from 'Components/utils/distanceLoc';
// rename path
import { makeTagColorScale } from 'Src/styles/GlobalThemeContext';
import { isCardSeen } from 'Constants/cardFields';

import { screenResize } from 'Reducers/Screen/actions';
import * as cardActions from 'Reducers/Cards/actions';

import * as asyncActions from 'Reducers/Cards/async_actions';
import * as dataViewActions from 'Reducers/DataView/actions';
import * as dataViewAsyncActions from 'Reducers/DataView/async_actions';

import withAuthorization from 'Src/components/withAuthorization';

import {
  CHALLENGE_SUBMITTED,
  isChallengeSubmitted
} from 'Constants/cardFields';

import CardViewPage from './CardViewPage';
// import mapViewReducer from './reducer';

const lowercase = s => s.toLowerCase();
const filterByTag = (doc, filterSet) =>
  filterSet.length === 0 ||
  intersection(doc.tags.map(lowercase), filterSet.map(lowercase)).length ===
    filterSet.length;

// const applyFilter = challengeState => d => {
//   if (challengeState === CHALLENGE_SUBMITTED) return isChallengeSubmitted(d);
//   return !isChallengeSubmitted(d);
// };

// Container
const mapStateToProps = state => {
  console.log('new Action', 'yeah');
  const { collectibleCards } = state.Cards;

  const {
    // selectedCardId,
    filterSet,
    cardPanelVisible
    // challengeStateFilter
  } = state.DataView;

  // TODO: own dim reducer
  const { width, height, userLocation, mapViewport } = state.MapView;

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

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...cardActions,
      ...asyncActions,
      ...dataViewActions,
      resizeCardWindow,
      userMove,
      screenResize,
      changeViewport,
      ...dataViewAsyncActions
    },
    dispatch
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
  const { dataView, history, match } = ownProps;
  const { path } = match;

  const { selectedCardId = null, showOption = null } = match.params;

  const extCardId = showOption === 'extended' ? selectedCardId : null;
  const selectedCardLocked = showOption === 'locked';

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

  const isInView = loc => {
    const coords = [loc.longitude, loc.latitude];
    const pos = mercator.project(coords);
    return pos[0] > 0 && pos[0] < width && pos[1] > 0 && pos[1] < height;
  };

  const routeLockedCard = id =>
    otherActions.routeLockedCard({
      path,
      history,
      id
    });

  const routeExtendCard = () => {
    otherActions.routeExtendCard({
      path,
      history,
      id: selectedCardId,
      extended: extCardId === null
    });
  };

  const routeSelectCard = id => {
    otherActions.routeSelectCard({ path, history, id });
  };

  const previewCardAction = d => {
    if (selectedCardId === d.id) {
      if (!d.accessible) {
        return routeLockedCard(d.id);
      }

      return routeExtendCard();
    }
    return routeSelectCard(d.id);
  };

  // TODO remove
  const fetchCards = () => {
    fetchCollectibleCards(uid);
  };

  const preSelectCardId = () => selectCard(null);

  // TODO: hack
  const isInDistance = loc =>
    distanceLoc(userLocation, loc) < accessibleRadius / 2 + 1;

  const filteredCards = collectibleCards
    .filter(d => filterByTag(d, filterSet))
    .map(c => {
      console.log('c', c);
      const accessible =
        (isInView(c.loc) && isInDistance(c.loc)) || isCardSeen(c);

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
    fetchCards,
    preSelectCardId,
    dataView,
    cards: filteredCards,
    cardSets,
    selectedTags,
    selectedCardId,
    extCardId,
    selectedCardLocked
  };
};

const authCondition = authUser => authUser !== null;

export default compose(
  withRouter,
  withAuthorization(authCondition),
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )
)(CardViewPage);
