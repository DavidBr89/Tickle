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
  flyToUser
} from './actions';

import { fetchDirection } from './async_actions';

import MapView from './MapView';

// import mapViewReducer from './reducer';

// Container
const mapStateToProps = state => {
  const {
    selectedCardId,
    cards,
    width,
    height,
    latitude,
    longitude,
    zoom,
    direction
  } = state.MapView;

  return {
    ...state.MapView,
    selectedCard:
      selectedCardId !== null ? cards.find(d => d.id === selectedCardId) : null,
    mapViewport: {
      width,
      height,
      zoom,
      latitude,
      longitude
    },
    setCardOpacity(c) {
      if (selectedCardId === c.id) return 1;
      if (direction === null) return 0.56;
      return 0.0;
    }
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
    console.log('before dispatch screenResize');
    dispatch(screenResize(options));
  },
  playCardChallengeAction: options => {
    dispatch(playCardChallenge(options));
  },
  toggleCardChallengeAction: options => {
    console.log('dispatch options', options);
    dispatch(toggleCardChallenge(options));
  },
  extCardAction: options => {
    console.log('dispatch options', options);
    dispatch(extendSelectedCard(options));
  },
  navigateFirstTimeAction: options => {
    console.log('dispatch options', options);
    dispatch(navigateAppFirstTime(options));
  },
  flyToUserAction: options => {
    console.log('dispatch options', options);
    dispatch(flyToUser(options));
  },
  fetchDirectionAction: options => {
    console.log('dispatch options', options);
    dispatch(fetchDirection(options));
  }
});

const MapViewCont = connect(mapStateToProps, mapDispatchToProps)(MapView);

export default MapViewCont;
