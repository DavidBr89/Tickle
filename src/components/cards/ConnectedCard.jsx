import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


import { asyncSubmitChallenge } from 'Reducers/Cards/async_actions';

import * as dataViewActions from 'Reducers/DataView/actions';
import * as routeActions from 'Reducers/DataView/async_actions';
import MediaChallenge from 'Components/Challenges/MediaChallenge';

import StarRating from 'Components/utils/StarRating';

import { ModalBody } from 'Utils/Modal';

import { PreviewTags } from 'Utils/Tag';
// import { BigButton } from './layout';

import { MediaList } from 'Utils/MediaUpload';
import { DB } from 'Firebase';

import cardRoutes from 'Src/Routes/cardRoutes';
import CardBack from './CardBack';
import ReadCardFront from './CardFront/ReadCardFront';
import CardFrame from './CardFrame';

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
    style={{ background: 'whitesmoke' }}
    footer={<button onClick={onClose}> Close </button>}
  >
    <div>
      <h4>Tags</h4>
      <PreviewTags data={tags} />
    </div>
    <div className="flex-full flexCol" style={{ background: 'smokewhite' }}>
      <div>
        <h4>User Response</h4>
        <p>{response}</p>
      </div>
      <div>
        <h4>Submitted Media</h4>
        <MediaList
          data={media}
          className="mb-3"
          disabled
        />
      </div>
      <div>
        <h4>Feedback</h4>
        <p style={{ width: '100%' }}>{text}</p>
      </div>
      <div>
        <h4>Rating</h4>
        <StarRating disabled num={5} highlighted={rating} />
      </div>
    </div>
  </ModalBody>
);

const CardViewable = ({
  flipped,
  onSubmitChallenge,
  userEnvSelectedId,
  uid,
  onFlip,
  onClose,
  id,
  ...props
}) => (
  <CardFrame
    key={id}
    front={
      <ReadCardFront
        {...props}
        onFlip={onFlip}
        onClose={onClose}
      />
    }
    back={
      <CardBack
        {...props}
        id={id}
        onClose={onClose}
        onFlip={onFlip}
        edit={false}
      />
    }
    flipped={flipped}
    {...props}
    challengeComp={
      <MediaChallenge
        {...props.challenge}
        bookmarkable
        removable
        title="Challenge"
        isSmartphone={false}
        key={id}
        challengeSubmission={props.challengeSubmission}
        onUpdate={(newChallengeSub) => {
          onSubmitChallenge({
            cardId: props.id,
            ...newChallengeSub
          });
        }}
      />
    }
  />
);

// props.challengeSubmission && props.challengeSubmission.feedback ? (
//   <ChallengeResult
//     tags={props.tags}
//     {...props.challengeSubmission}
//     {...props.challengeSubmission.feedback}
//   />
// ) : (

const mapStateToProps = state => ({
  ...state.Screen,
  ...state.Session
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    // dragCard,
    ...dataViewActions,
    asyncSubmitChallenge,
    ...routeActions
  },
  dispatch,
);

const mergeProps = (state, dispatcherProps, ownProps) => {
  const {
    location, match, history, id
  } = ownProps;
  const { authUser } = state;
  const { uid } = authUser;
  const { asyncSubmitChallenge } = dispatcherProps;
  // TODO replace by regex

  const { userEnv } = match.params;

  const {
    query: { selectedCardId, extended, flipped },
    routing: { routeFlipCard, routeExtendCard }
  } = cardRoutes({ history, location });

  // console.log('render');

  const onClose = () => {
    routeExtendCard();
  };

  const onSubmitChallenge = (challengeSubmission) => {
    asyncSubmitChallenge({ playerId: uid, ...challengeSubmission });
  };

  const onFlip = () => {
    routeFlipCard();
  };

  const db = DB(userEnv);
  const fetchAuthorData = () => {

    console.log('uid', uid)
    return db.getDetailedUserInfo(uid) };
  const fetchComments = id ? () => db.readComments(id) : null;
  const addComment = text => db.addComment({ uid, cardId: id, text });

  return {
    ...state,
    ...dispatcherProps,
    ...ownProps,
    onSubmitChallenge,
    fetchAuthorData,
    fetchComments,
    addComment,
    onClose,
    onFlip,
    flipped
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
