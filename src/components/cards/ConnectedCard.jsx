import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Card } from './index';

import { asyncSubmitChallenge } from 'Reducers/Cards/async_actions';

import * as dataViewActions from 'Reducers/DataView/actions';

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
    {...props}
    key={props.id}
    edit={false}
    bookmarkable
    onClose={() => extendSelectedCard(null)}
    tagColorScale={tagColorScale}
    onSubmitChallenge={onSubmitChallenge}
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
