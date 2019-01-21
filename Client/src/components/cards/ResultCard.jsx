import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';

import {withRouter} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {asyncSubmitActivity} from 'Reducers/Cards/async_actions';

import * as dataViewActions from 'Reducers/DataView/actions';
import * as routeActions from 'Reducers/DataView/async_actions';
import MediaChallenge from 'Components/Challenges/MediaChallenge';
import {Card} from './index';
import ReadCardFront from './CardFront/ReadCardFront';

// import { BigButton } from './layout';

const CardViewable = ({
  iOS,
  smallScreen,
  closeCard,
  tagColorScale,
  onSubmitActivity,
  isSmartphone,
  flipped,
  android,
  onChallengeClick,
  onCreate,
  template,
  ...props
}) => (
  <Card
    key={props.id}
    {...props}
    iOS={iOS}
    smallScreen={smallScreen}
    bookmarkable
    front={<ReadCardFront />}
    onClose={closeCard}
    frontView={flipped}
    challengeComp={
      <MediaChallenge
        {...props.activity}
        title="Challenge"
        isSmartphone={isSmartphone}
        key={props.id}
        challengeSubmission={props.challengeSubmission}
        onUpdate={newChallengeSub => {
          onSubmitActivity({
            cardId: props.id,
            ...newChallengeSub
          });
        }}
      />
    }
  />
);

const mapStateToProps = state => ({
  ...state.Screen,
  ...state.Session
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      // dragCard,
      ...dataViewActions,
      asyncSubmitActivity,
      ...routeActions
    },
    dispatch
  );

const mergeProps = (state, dispatcherProps, ownProps) => {
  const {match, history, id} = ownProps;
  const {authUser} = state;
  const {uid} = authUser;
  const {path} = match;
  const {flipped} = match.params;
  const {
    routeExtendCard,
    routeFlipCard,
    asyncSubmitActivity
  } = dispatcherProps;
  // TODO replace by regex

  const closeCard = () => {
    routeExtendCard({path, history, id, extended: false});
  };

  const onSubmitActivity = challengeSubmission => {
    asyncSubmitActivity({playerId: uid, ...challengeSubmission});
  };

  const flipHandler = () => {
    routeFlipCard({match, history});
  };

  return {
    ...state,
    ...dispatcherProps,
    ...ownProps,
    onSubmitActivity,
    closeCard,
    flipHandler,
    // TODO refactor
    frontView: !flipped
  };
};

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )
)(CardViewable);
