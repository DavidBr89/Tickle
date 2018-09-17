import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Card } from './index';

import { asyncSubmitChallengeReview } from 'Reducers/Admin/async_actions';

import * as dataViewActions from 'Reducers/DataView/actions';

import MediaChallengeReview from 'Components/Challenges/MediaChallenge/MediaChallengeReview';

const CardReview = ({
  iOS,
  smallScreen,
  extendSelectedCard,
  tagColorScale,
  submitChallengeReview,
  uid,
  ...props
}) => (
  <Card
    iOS={iOS}
    smallScreen={smallScreen}
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
      submitChallengeReview: asyncSubmitChallengeReview
    },
    dispatch
  );

const mergeProps = (state, dispatcherProps, ownProps) => {
  const { authUser } = state;
  const { uid } = authUser;

  // const { asyncSubmitChallengeReview } = dispatcherProps;
  //
  // const onSubmitChallenge = challengeSubmission => {
  //   asyncSubmitChallengeReview({ playerId: uid, ...challengeSubmission });
  // };

  return {
    ...state,
    ...dispatcherProps,
    ...ownProps,
    uid
    // onSubmitChallenge
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(CardReview);
