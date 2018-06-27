// import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { intersection } from 'lodash';
import {
  resizeCardWindow,
  userMove,
  changeMapViewport,
  screenResize,
  changeViewport
} from 'Reducers/Map/actions';

import setify from 'Utils/setify';

import * as cardActions from 'Reducers/Cards/actions';

import * as asyncActions from 'Reducers/Cards/async_actions';
import * as dataViewActions from 'Reducers/DataView/actions';

// import { fetchDirection } from 'Reducers/Map/async_actions';

import MapViewPage from './MapViewPage';

// import mapViewReducer from './reducer';

// Container
const mapStateToProps = state => {
  const {
    readableCards,
    createdCards,
    selectedCardId,
    cardTemplateId,
    tmpCard,
    filterSet
  } = state.Cards;

  // TODO: own dim reducer
  const { width, height, userLocation } = state.MapView;

  const { authEnv } = state.DataView;
  const authUser = state.Session;

  // const { userLocation } = state.MapView;

  // console.log('cardTemplate', cardTemplate);
  const defaultCardTemplate = {
    id: cardTemplateId,
    template: true,
    loc: userLocation,
    edit: true,
    tags: [],
    challenge: null,
    floorLoc: { relX: 0.5, relY: 0.5 },
    author: { ...authUser }
  };

  const templateCard = {
    ...defaultCardTemplate,
    ...tmpCard,
    tags: tmpCard.tags || []
  };

  const cards = authEnv ? [...createdCards] : readableCards;
  const filteredCards = cards
    .filter(
      d => filterSet.length === 0 || intersection(d.tags, filterSet).length > 0
    )
    .concat([templateCard]);

  const cardSets = setify(filteredCards);

  console.log('SelectedCardId', selectedCardId);
  const selectedCard =
    selectedCardId !== null
      ? filteredCards.find(d => d.id === selectedCardId)
      : null;

  const selectedTags =
    selectedCard !== null
      ? selectedCard.tags
      : filterSet.length > 0
        ? filterSet
        : cardSets.map(d => d.key);

  return {
    // TODO: make more specific
    ...state.MapView,
    ...state.Cards,
    ...state.DataView,
    selectedCard,
    selectedTags,
    selectedCardId,
    cardSets,
    // selectedTags,
    cards: filteredCards,
    authUser
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
      changeMapViewport,
      screenResize,
      changeViewport
    },
    dispatch
  );

// });

const mergeProps = (state, dispatcherProps) => {
  const {
    selectedCardId,
    mapViewport,
    width,
    height,
    dataView,
    authUser,
    extCardId
  } = state;
  const { uid } = authUser;

  const {
    asyncUpdateCard,
    updateCardTemplate,
    asyncCreateCard,
    asyncRemoveCard,
    toggleDataView,
    selectCard,
    extendSelectedCard
  } = dispatcherProps;

  const viewport = { ...mapViewport, width, height };
  const onCardDrop = cardData =>
    selectedCardId === 'temp'
      ? updateCardTemplate({ uid, cardData, viewport, dataView })
      : asyncUpdateCard({ uid, cardData, viewport, dataView });

  const cardAction = cardData =>
    selectedCardId === 'temp'
      ? asyncCreateCard({ uid, cardData, viewport, dataView })
      : asyncRemoveCard({ uid, cid: cardData.id });

  const onCardUpdate = cardData =>
    selectedCardId === 'temp'
      ? updateCardTemplate({ cardData, viewport, dataView })
      : asyncUpdateCard({ uid, cardData, viewport, dataView });

  // TODO: change
  const setDataView = toggleDataView;
  const previewCardAction = d =>
    selectedCardId === d.id ? extendSelectedCard(d.id) : selectCard(d.id);

  const unSelectCard = () => (extCardId === null ? selectCard(null) : d => d);

  return {
    ...state,
    ...dispatcherProps,
    onCardDrop,
    onCardUpdate,
    cardAction,
    setDataView,
    previewCardAction,
    unSelectCard
  };
};

const MapView = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(MapViewPage);

export default MapView;
