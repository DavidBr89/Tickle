import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';

import {withRouter} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {asyncSubmitActivity} from 'Reducers/Cards/async_actions';

import * as dataViewActions from 'Reducers/DataView/dataViewThunks';
import MediaChallenge from 'Components/Challenges/MediaChallenge';

// import StarRating from 'Components/utils/StarRating';

import {ModalBody} from 'Utils/Modal';

import {PreviewTags} from 'Utils/Tag';

import {DB} from 'Firebase';

import cardRoutes from 'Src/Routes/cardRoutes';
import {initCardFields} from 'Src/constants/cardFields';
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
                // TODO: remove later
                description: 'placeholder',
                title: 'placeholder title'
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

CardViewable.defaultProps = {
  // ...initcardfields
};
// props.activitySubmission && props.activitySubmission.feedback ? (
//   <ChallengeResult
//     tags={props.tags}
//     {...props.activitySubmission}
//     {...props.activitySubmission.feedback}
//   />
// ) : (

const mapStateToProps = state => {
  console.log('state', state);
  const {userLocation} = state.MapView;
  const {authUser} = state.Session;
  const {topicVocabulary} = state.Cards;

  return {userLocation, authUser, topicVocabulary};
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      // dragCard,
      ...dataViewActions,
      asyncSubmitActivity
      // ...routeActions,
    },
    dispatch
  );

const mergeProps = (state, dispatcherProps, ownProps) => {
  console.log('ConnectedCard ownProps', ownProps);
  const defProps = {...initCardFields, ...ownProps};
  const {
    location,
    match,
    history,
    id: cardId,
    uid: authorId,
    topics: {value: topicValues},
    onClose
  } = defProps;

  const {topicVocabulary, userLocation} = state;

  const {authUser} = state;
  const {uid: playerId} = authUser;
  const {asyncSubmitActivity} = dispatcherProps;

  const {userEnv} = match.params;

  const {
    query: {selectedCardId, extended, flipped},
    routing: {routeFlipCard, routeExtendCard}
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
      userEnv
    });
  };

  const db = DB(userEnv);

  const filePath = `activitySubmissions/${cardId}/${playerId}`;

  const onFlip = routeFlipCard;

  const relatedCardsByTag =
    topicValues !== null
      ? topicVocabulary.filter(d => topicValues.includes(d.tagId))
      : [];

  const backCardFuncs = makeBackCardFuncs({
    userEnv,
    cardId,
    playerId,
    authorId
  });

  return {
    ...state,
    ...dispatcherProps,
    ...defProps,
    onSubmitActivity,
    ...backCardFuncs,
    addFileToEnv: db.addFileToEnv,
    removeFromEnv: db.removeFileFromEnv,
    onClose: onClose || closeHandler,
    onFlip,
    flipped,
    relatedCardsByTag
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
