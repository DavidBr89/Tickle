import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Card } from './index';

import { asyncSubmitChallenge } from 'Reducers/Cards/async_actions';

import * as dataViewActions from 'Reducers/DataView/actions';
import MediaChallenge from 'Components/Challenges/MediaChallenge';

const CardViewable = ({
  iOS,
  smallScreen,
  extendSelectedCard,
  tagColorScale,
  onSubmitChallenge,
  ...props
}) => (
  <Card
    iOS={iOS}
    smallScreen={smallScreen}
    key={props.id}
    edit={false}
    bookmarkable
    onClose={() => extendSelectedCard(null)}
    tagColorScale={tagColorScale}
    uiColor="grey"
    background="whitesmoke"
    style={{ zIndex: 4000 }}
    {...props}
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
      asyncSubmitChallenge
    },
    dispatch
  );

const mergeProps = (state, dispatcherProps, ownProps) => {
  const { authUser } = state;
  const { uid } = authUser;

  const { asyncSubmitChallenge } = dispatcherProps;

  const onSubmitChallenge = challengeSubmission => {
    asyncSubmitChallenge({ playerId: uid, ...challengeSubmission });
  };

  return {
    ...state,
    ...dispatcherProps,
    ...ownProps,
    onSubmitChallenge
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(CardViewable);
