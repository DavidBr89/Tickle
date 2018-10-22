import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';

import {withRouter} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {Card} from './index';

import {asyncSubmitChallenge} from 'Reducers/Cards/async_actions';

import * as dataViewActions from 'Reducers/DataView/actions';
import * as routeActions from 'Reducers/DataView/async_actions';
import MediaChallenge from 'Components/Challenges/MediaChallenge';
import ReadCardFront from './CardFront/ReadCardFront';

import StarRating from 'Components/utils/StarRating';

import {ModalBody} from 'Utils/Modal';

import {PreviewTags} from 'Utils/Tag';
// import { BigButton } from './layout';

import {stylesheet} from 'Src/styles/GlobalThemeContext';
import {MediaList} from 'Utils/MediaUpload';

// TODO: outsource
const ChallengeResult = ({
  onClose,
  media,
  tags,
  response,
  title,
  rating,
  text
}) => (
  <ModalBody
    onClose={onClose}
    title={title}
    style={{background: 'whitesmoke'}}
    footer={
      <button
        onClick={() => {
          onClose();
        }}
      >
        Close
      </button>
    }
  >
    <div>
      <h4>Tags</h4>
      <PreviewTags data={tags} />
    </div>
    <div className="flex-full flexCol" style={{background: 'smokewhite'}}>
      <div>
        <h4>User Response</h4>
        <p>{response}</p>
      </div>
      <div>
        <h4>Submitted Media</h4>
        <MediaList
          data={media}
          className="mb-3"
          stylesheet={stylesheet}
          disabled
        />
      </div>
      <div>
        <h4>Feedback</h4>
        <p style={{width: '100%'}}>{text}</p>
      </div>
      <div>
        <h4>Rating</h4>
        <StarRating disabled num={5} highlighted={rating} />
      </div>
    </div>
  </ModalBody>
);

const CardViewable = ({
  iOS,
  smallScreen,
  closeCard,
  tagColorScale,
  onSubmitChallenge,
  isSmartphone,
  flipped,
  android,
  onChallengeClick,
  onCreate,
  template,
  ...props
}) => (
  <Card
    iOS={iOS}
    smallScreen={smallScreen}
    key={props.id}
    bookmarkable
    front={<ReadCardFront />}
    onClose={closeCard}
    tagColorScale={tagColorScale}
    uiColor="grey"
    background="whitesmoke"
    frontView={flipped}
    {...props}
    challengeComp={
      props.challengeSubmission && props.challengeSubmission.feedback ? (
        <ChallengeResult
          tags={props.tags}
          {...props.challengeSubmission}
          {...props.challengeSubmission.feedback}
        />
      ) : (
        <MediaChallenge
          {...props.challenge}
          bookmarkable
          removable
          title="Challenge"
          isSmartphone={isSmartphone}
          key={props.id}
          challengeSubmission={props.challengeSubmission}
          onUpdate={newChallengeSub => {
            onSubmitChallenge({
              cardId: props.id,
              ...newChallengeSub
            });
          }}
        />
      )
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
    dispatch,
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
    asyncSubmitChallenge
  } = dispatcherProps;
  // TODO replace by regex

  const closeCard = () => {
    routeExtendCard({path, history, id, extended: false});
  };

  const onSubmitChallenge = challengeSubmission => {
    asyncSubmitChallenge({playerId: uid, ...challengeSubmission});
  };

  const flipHandler = () => {
    routeFlipCard({match, history});
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
    mergeProps,
  ),
)(CardViewable);
