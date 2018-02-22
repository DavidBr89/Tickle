// import React from 'react';
import { connect } from 'react-redux';
import { timeParse } from 'd3';
import { timespec } from './helper';
// import { toggleChallenge } from '../actions';
import {
  screenResize,
  changeMapViewport,
  selectCard,
  createCard,
  dragCard,
  openCardDetails,
  toggleCardTemplate,
  updateCardTemplate,
  updateCardLocation,
  updateCardAttrs
} from './actions';

import CardCreator from './CardCreator';

// import mapViewReducer from './reducer';

// Container
// const tif = timeFormat(timespec);
// const tip = timeParse(timespec);

const mapStateToProps = state => ({
  ...state.CardCreator,
  // TODO: check later when real cards changed
  cards: state.CardCreator.cards.sort((a, b) => b.id - a.id),
  selectedCardId: state.CardCreator.selected ? state.CardCreator.selected.id : null,
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  screenResizeAction: options => {
    dispatch(screenResize(options));
  },
  changeMapViewport: options => {
    dispatch(changeMapViewport(options));
  },
  selectCardAction: options => {
    dispatch(selectCard(options));
  },
  openCardDetails: options => {
    dispatch(openCardDetails(options));
  },
  toggleCardTemplateAction: options => {
    dispatch(toggleCardTemplate(options));
  },
  createCardAction: options => {
    dispatch(createCard(options));
  },
  dragCardAction: options => {
    dispatch(dragCard(options));
  },
  updateCardTemplateAction: options => {
    dispatch(updateCardTemplate(options));
  },
  updateCardLocationAction: options => {
    dispatch(updateCardLocation(options));
  },
  updateCardAttrsAction: options => {
    dispatch(updateCardAttrs(options));
  }
});

const CardCreatorCont = connect(mapStateToProps, mapDispatchToProps)(
  CardCreator
);

export default CardCreatorCont;
