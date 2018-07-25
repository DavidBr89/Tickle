// import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';

import { intersection } from 'lodash';
import {
  resizeCardWindow,
  userMove,
  changeViewport
} from 'Reducers/Map/actions';

import setify from 'Utils/setify'; // eslint-disable-line
import { makeTagColorScale } from 'Src/styles/GlobalThemeContext'; // eslint-disable-line
import { screenResize } from 'Reducers/Screen/actions';
import * as cardActions from 'Reducers/Cards/actions';
import * as asyncActions from 'Reducers/Cards/async_actions';
import * as dataViewActions from 'Reducers/DataView/actions';

// import { fetchDirection } from 'Reducers/Map/async_actions';

import CardAuthorPage from './CardAuthorPage';

import withAuthorization from 'Src/components/withAuthorization';

// import mapViewReducer from './reducer';

// Container
const mapStateToProps = state => {
  const { createdCards, tmpCard } = state.Cards;

  const { selectedCardId, filterSet } = state.DataView;
  console.log('selectedCardid', selectedCardId);

  // TODO: own dim reducer
  const { width, height, userLocation } = state.MapView;

  // const { authEnv } = state.DataView;
  const {
    authUser: { uid, username }
  } = state.Session;

  const templateCard = {
    ...tmpCard,
    uid,
    tags: tmpCard.tags.length > 0 ? tmpCard.tags : [username]
  };

  const filteredCards = createdCards.filter(
    d =>
      filterSet.length === 0 ||
      intersection(d.tags, filterSet).length === filterSet.length
  );

  const cards = [templateCard, ...filteredCards];

  const cardSets = setify(cards);

  const tagColorScale = makeTagColorScale(cardSets);

  const selectedCard = cards.find(d => d.id === selectedCardId) || null;

  const selectedTags = selectedCard !== null ? selectedCard.tags : filterSet;

  return {
    ...state.MapView,
    ...state.DataView,
    ...state.Cards,
    ...state.Screen,
    uid,
    selectedCardId,
    filterSet,
    templateCard,
    cardSets,
    cards,
    selectedTags,
    tagColorScale
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
      changeViewport
    },
    dispatch
  );

// });

const mergeProps = (state, dispatcherProps, ownProps) => {
  const {
    selectedCardId,
    uid,
    templateCard,
    createdCards,
    cards,
    filterSet
  } = state;
  console.log('card author state', state);
  const {
    selectCard,
    extendSelectedCard,
    // fetchReadableCards,
    fetchCreatedCards
  } = dispatcherProps;

  const { dataView } = ownProps;

  const previewCardAction = d =>
    selectedCardId === d.id ? extendSelectedCard(d.id) : selectCard(d.id);

  const fetchCards = () => {
    fetchCreatedCards(uid);
  };
  const preSelectCardId = () => selectCard(templateCard.id);

  return {
    ...state,
    ...dispatcherProps,
    previewCardAction,
    fetchCards,
    preSelectCardId,
    dataView,
    selectedCardId
  };
};

const authCondition = authUser => authUser !== null;

export default compose(
  withAuthorization(authCondition),
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )
)(CardAuthorPage);
