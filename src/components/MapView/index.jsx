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
  navigateAppFirstTime
} from './actions';

import MapView from './MapView';

// import mapViewReducer from './reducer';

// Container
const mapStateToProps = state => ({
  ...state.MapView,
  selectedCard:
    //TODO: clean uo
    state.MapView.selectedCardId !== null
      ? state.MapView.cards.find(d => d.id === state.MapView.selectedCardId)
      : null
});

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
  }
});

const MapViewCont = connect(mapStateToProps, mapDispatchToProps)(MapView);

export default MapViewCont;
