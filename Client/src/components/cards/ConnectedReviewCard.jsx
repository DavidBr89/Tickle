import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {withRouter} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {compose} from 'recompose';

import {asyncSubmitChallengeReview} from '~/reducers/Admin/async_actions';

import * as dataViewActions from '~/reducers/DataView/actions';


import ReadCardFront from './CardFront/ReadCardFront';

const CardReview = ({
  iOS,
  smallScreen,
  extendSelectedCard,
  tagColorScale,
  submitChallengeReview,
  uid,
  onFlip,
  description,
  tags,
  challengeSubmission,
  title,
  onClose,
  ...props
}) => (
  <div>TODO</div>
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
  const {authUser} = state;
  const {uid} = authUser;

  // const { path } = match;

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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(CardReview);
