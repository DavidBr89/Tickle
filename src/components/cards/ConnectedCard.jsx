import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Card } from './index';

import { asyncSubmitChallenge } from 'Reducers/Cards/async_actions';

import * as dataViewActions from 'Reducers/DataView/actions';
import * as routeActions from 'Reducers/DataView/async_actions';
import MediaChallenge from 'Components/Challenges/MediaChallenge';

const CardViewable = ({
  iOS,
  smallScreen,
  closeCard,
  tagColorScale,
  onSubmitChallenge,
  flipped,
  ...props
}) => (
  <Card
    iOS={iOS}
    smallScreen={smallScreen}
    key={props.id}
    bookmarkable
    onClose={closeCard}
    tagColorScale={tagColorScale}
    uiColor="grey"
    background="whitesmoke"
    style={{ zIndex: 4000 }}
    frontView={flipped}
    {...props}
    edit={false}
    challengeComp={
      <MediaChallenge
        {...props.challenge}
        bookmarkable
        removable
        title="Challenge"
        key={props.id}
        challengeSubmission={props.challengeSubmission}
        onUpdate={d => {
          onSubmitChallenge({
            cardId: props.id,
            ...props.challengeSubmission,
            ...d
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
      asyncSubmitChallenge,
      ...routeActions
    },
    dispatch
  );

const mergeProps = (state, dispatcherProps, ownProps) => {
  const { match, history, id } = ownProps;
  const { authUser } = state;
  const { uid } = authUser;
  const { path } = match;
  const { flipped } = match.params;
  const {
    routeExtendCard,
    routeFlipCard,
    asyncSubmitChallenge
  } = dispatcherProps;
  // TODO replace by regex

  const closeCard = () => {
    routeExtendCard({ path, history, id, extended: false });
  };

  const onSubmitChallenge = challengeSubmission => {
    asyncSubmitChallenge({ playerId: uid, ...challengeSubmission });
  };

  const flipHandler = () => {
    routeFlipCard({ match, history });
  };

  return {
    ...state,
    ...dispatcherProps,
    ...ownProps,
    onSubmitChallenge,
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
