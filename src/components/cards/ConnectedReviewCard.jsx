import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { Card } from './index';

import { asyncSubmitChallengeReview } from 'Reducers/Admin/async_actions';

import * as dataViewActions from 'Reducers/DataView/actions';

import * as routeActions from 'Reducers/DataView/async_actions';

import MediaChallengeReview from 'Components/Challenges/MediaChallenge/MediaChallengeReview';

import ReadCardFront from './CardFront/ReadCardFront';

const CardReview = ({
  iOS,
  smallScreen,
  extendSelectedCard,
  tagColorScale,
  submitChallengeReview,
  uid,
  onFlip,
  ...props
}) => (
  <Card
    iOS={iOS}
    smallScreen={smallScreen}
    front={<ReadCardFront />}
    flipHandler={onFlip}
    challengeComp={
      <MediaChallengeReview
        title="Challenge Review"
        {...props.challenge}
        {...props.challengeSubmission}
        onSubmit={fb => {
          submitChallengeReview({
            ...props.challengeSubmission,
            feedback: { ...fb, uid }
          });
        }}
      />
    }
    {...props}
    key={props.id}
    edit={false}
    bookmarkable
    tagColorScale={tagColorScale}
    uiColor="grey"
    background="whitesmoke"
    style={{ zIndex: 4000 }}
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
      ...routeActions,
      submitChallengeReview: asyncSubmitChallengeReview
    },
    dispatch
  );

const mergeProps = (state, dispatcherProps, ownProps) => {
  const { authUser } = state;
  const { uid } = authUser;

  const { match, history } = ownProps;
  const { path } = match;

  const { flipped } = match.params;

  const { routeFlipCard } = dispatcherProps;
  // const onFlip = () => routeFlipCard({ match, history });
  // const { asyncSubmitChallengeReview } = dispatcherProps;
  //
  // const onSubmitChallenge = challengeSubmission => {
  //   asyncSubmitChallengeReview({ playerId: uid, ...challengeSubmission });
  // };

  return {
    ...state,
    ...dispatcherProps,
    ...ownProps,
    // onFlip,
    uid
    // onSubmitChallenge
  };
};

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )
)(CardReview);
