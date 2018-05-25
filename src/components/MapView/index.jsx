// import React from 'react';
import { connect } from 'react-redux';
// import { toggleChallenge } from '../actions';
import {
  selectCard,
  resizeCardWindow,
  userMove,
  changeMapViewport,
  screenResize,
  playCardChallenge,
  toggleCardChallenge,
  extendSelectedCard,
  navigateAppFirstTime,
  flyToUser,
  toggleTagList,
  toggleTsneView,
  toggleGrid,
  filterCards,
  toggleSearch,
  dragCard,
  changeViewport,
  toggleCardAuthoring
} from 'Reducers/Map/actions';

import { updateCard, createCard } from 'Reducers/Cards/actions';

import { fetchDirection } from 'Reducers/Map/async_actions';

import MapView from './MapView';

// import mapViewReducer from './reducer';

// Container
const mapStateToProps = state => {
  const {
    selectedCardId,
    width,
    height,
    latitude,
    longitude,
    zoom,
    direction,
    authEnv,
    mapViewport
    // userSelected,
    // userLocation,
    // directionLoading
  } = state.MapView;

  const { accessibleCards, createdCards, cardTemplate } = state.Cards;

  const cards = authEnv ? [...createdCards, cardTemplate] : accessibleCards;

  const selectedCard =
    selectedCardId !== null ? cards.find(d => d.id === selectedCardId) : null;

  return {
    ...state.MapView,
    selectedCard,
    cards
  };
};

const mapDispatchToProps = dispatch => ({
  cardClick: card => {
    dispatch(selectCard(card));
  },
  resizeCardWindow: options => {
    dispatch(resizeCardWindow(options));
  },
  userMoveAction: pos => {
    dispatch(userMove(pos));
  },
  changeMapViewportAction: viewport => {
    dispatch(changeMapViewport(viewport));
  },
  selectCardAction: options => {
    // console.log('dispatch', viewport);
    dispatch(selectCard(options));
  },
  screenResizeAction: options => {
    dispatch(screenResize(options));
  },
  playCardChallengeAction: options => {
    dispatch(playCardChallenge(options));
  },
  toggleCardChallengeAction: options => {
    dispatch(toggleCardChallenge(options));
  },
  extCardAction: options => {
    dispatch(extendSelectedCard(options));
  },
  navigateFirstTimeAction: options => {
    dispatch(navigateAppFirstTime(options));
  },
  flyToUserAction: options => {
    dispatch(flyToUser(options));
  },
  fetchDirectionAction: options => {
    dispatch(fetchDirection(options));
  },
  toggleTagListAction: options => {
    dispatch(toggleTagList(options));
  },
  toggleTsneViewAction: options => {
    dispatch(toggleTsneView(options));
  },
  toggleGridAction: options => {
    dispatch(toggleGrid(options));
  },
  filterCardsAction: options => {
    dispatch(filterCards(options));
  },
  toggleSearchAction: options => {
    dispatch(toggleSearch(options));
  },
  dragCardAction: options => {
    dispatch(dragCard(options));
  },
  updateCardAction: options => {
    dispatch(updateCard(options));
  },
  changeViewportAction: options => {
    dispatch(changeViewport(options));
  },
  toggleCardAuthoringAction: options => {
    dispatch(toggleCardAuthoring(options));
  },
  createCardAction: options => {
    dispatch(createCard(options));
  }
});

const mergeProps = (state, dispatcherProps) => {
  const {
    selectedCard,
    userLocation,
    selectedCardId,
    direction,
    directionLoading,
    userSelected,
    cards: collectibleCards,
    authEnv,
    createdCards,
    cardTemplate,
    accessibleCards,
    mapViewport
  } = state;
  const {
    fetchDirectionAction,
    selectCardAction,
    flyToUserAction,
    createCardAction,
    updateCardAction
  } = dispatcherProps;

  const cardAction =
    selectedCardId === 'temp' ? createCardAction : updateCardAction;

  const cardDropHandler = cardData => cardAction({ cardData, mapViewport });

  // const nextCardControlAction = (() => {
  //   if (userSelected && direction !== null) {
  //     return {
  //       key: 'selectCard',
  //       func: () => selectCardAction(selectedCardId)
  //     };
  //   }
  //   if (directionLoading) return { key: 'directionLoading', func: d => d };
  //   if (direction === null) {
  //     return {
  //       key: 'route',
  //       func: () =>
  //         fetchDirectionAction({
  //           startCoords: userLocation,
  //           destCoords: selectedCard.loc
  //         })
  //     };
  //   }
  //
  //   return { key: 'flyToUser', func: flyToUserAction };
  // })();

  // TODO
  // display: extCardId !== c.id && c.template && 'none'
  // const templateId = extCardId !== c.id && c.template && 'none'

  return { ...state, ...dispatcherProps, cardDropHandler };
};

const MapViewCont = connect(mapStateToProps, mapDispatchToProps, mergeProps)(
  MapView
);

export default MapViewCont;
