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

// import StarRating from 'Components/utils/StarRating';

import {ModalBody} from 'Utils/Modal';

import {PreviewTags} from 'Utils/Tag';
// import { BigButton } from './layout';

// import { MediaList } from 'Utils/MediaUpload';
import {DB} from 'Firebase';

import cardRoutes from 'Src/Routes/cardRoutes';
import makeBackCardFuncs from './backCardDbMixins';
import CardBack from './CardBack';
import ReadCardFront from './CardFront/ReadCardFront';
import CardFrame from './CardFrame';

const CardViewable = ({
  flipped,
  removeFromStorage,
  addToStorage,
  onSubmitActivity,
  userEnvSelectedId,
  uid,
  onFlip,
  onClose,
  activitySubmission,
  id,
  activity,
  ...props
}) => (
  <CardFrame
    key={id}
    front={
      <ReadCardFront
        {...props}
        onFlip={onFlip}
        onClose={onClose}
        challengeComp={
          <MediaChallenge
            activity={
              activity.value || {
                //TODO: remove later
                description: 'placeholder',
                title: 'placeholder title',
              }
            }
            submission={activitySubmission}
            key={id}
            removeFromStorage={removeFromStorage}
            addToStorage={addToStorage}
            onSubmit={onSubmitActivity}
          />
        }
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
  />
);

// props.activitySubmission && props.activitySubmission.feedback ? (
//   <ChallengeResult
//     tags={props.tags}
//     {...props.activitySubmission}
//     {...props.activitySubmission.feedback}
//   />
// ) : (

const mapStateToProps = state => ({
  ...state.Screen,
  ...state.Session,
  ...state.Cards,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      // dragCard,
      ...dataViewActions,
      asyncSubmitActivity,
      ...routeActions,
    },
    dispatch,
  );

const mergeProps = (state, dispatcherProps, ownProps) => {
  const {
    location,
    match,
    history,
    id: cardId,
    uid: authorId,
    tags: {value: tagValues},
    onClose,
  } = ownProps;

  const {tagVocabulary} = state;

  const {authUser} = state;
  const {uid: playerId} = authUser;
  const {asyncSubmitActivity} = dispatcherProps;

  const {userEnv} = match.params;

  const {
    query: {selectedCardId, extended, flipped},
    routing: {routeFlipCard, routeExtendCard},
  } = cardRoutes({history, location});

  // console.log('render');

  const closeHandler = () => {
    routeExtendCard();
  };

  const onSubmitActivity = challData => {
    asyncSubmitActivity({
      ...challData,
      playerId,
      cardId,
      userEnv,
    });
  };

  const db = DB(userEnv);

  const filePath = `activitySubmissions/${cardId}/${playerId}`;
  const removeFromStorage = fileId =>
    db.removeFileFromEnv({
      path: filePath,
      id: fileId,
    });
  const addToStorage = ({file, id}) =>
    db.addFileToEnv({file, path: filePath, id});

  const onFlip = routeFlipCard;

  const relatedCardsByTag =
    tagValues !== null
      ? tagVocabulary.filter(d => tagValues.includes(d.tagId))
      : [];

  const backCardFuncs = makeBackCardFuncs({
    userEnv,
    cardId,
    playerId,
    authorId,
  });

  return {
    ...state,
    ...dispatcherProps,
    ...ownProps,
    onSubmitActivity,
    ...backCardFuncs,
    addToStorage,
    removeFromStorage,
    onClose: onClose || closeHandler,
    onFlip,
    flipped,
    relatedCardsByTag,
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
