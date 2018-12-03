import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';

import {withRouter} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {asyncSubmitChallenge} from 'Reducers/Cards/async_actions';

import * as dataViewActions from 'Reducers/DataView/actions';
import * as routeActions from 'Reducers/DataView/async_actions';
import MediaChallenge from 'Components/Challenges/MediaChallenge';

import StarRating from 'Components/utils/StarRating';

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

// TODO: outsource
// const ChallengeResult = ({
//   closeHandler,
//   media,
//   tags,
//   response,
//   title,
//   rating,
//   text
// }) => (
//   <ModalBody
//     closeHandler={closeHandler}
//     title={title}
//     style={{ background: 'whitesmoke' }}
//     footer={<button onClick={closeHandler}> Close </button>}
//   >
//     <div>
//       <h4>Tags</h4>
//       <PreviewTags data={tags} />
//     </div>
//     <div className="flex-full flexCol" style={{ background: 'smokewhite' }}>
//       <div>
//         <h4>User Response</h4>
//         <p>{response}</p>
//       </div>
//       <div>
//         <h4>Submitted Media</h4>
//         <MediaList
//           data={media}
//           className="mb-3"
//           disabled
//         />
//       </div>
//       <div>
//         <h4>Feedback</h4>
//         <p style={{ width: '100%' }}>{text}</p>
//       </div>
//       <div>
//         <h4>Rating</h4>
//         <StarRating disabled num={5} highlighted={rating} />
//       </div>
//     </div>
//   </ModalBody>
// );

const CardViewable = ({
  flipped,
  removeFromStorage,
  addToStorage,
  onSubmitChallenge,
  userEnvSelectedId,
  uid,
  onFlip,
  onClose,
  challengeSubmission,
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
        challengeComp={
          <MediaChallenge
            {...challengeSubmission}
            key={id}
            removeFromStorage={removeFromStorage}
            addToStorage={addToStorage}
            onSubmit={onSubmitChallenge}
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

// props.challengeSubmission && props.challengeSubmission.feedback ? (
//   <ChallengeResult
//     tags={props.tags}
//     {...props.challengeSubmission}
//     {...props.challengeSubmission.feedback}
//   />
// ) : (

const mapStateToProps = state => ({
  ...state.Screen,
  ...state.Session,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      // dragCard,
      ...dataViewActions,
      asyncSubmitChallenge,
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
    onClose,
  } = ownProps;

  const {authUser} = state;
  const {uid: playerId} = authUser;
  const {asyncSubmitChallenge} = dispatcherProps;

  console.log('ownProps', ownProps);

  const {userEnv} = match.params;

  const {
    query: {selectedCardId, extended, flipped},
    routing: {routeFlipCard, routeExtendCard},
  } = cardRoutes({history, location});

  // console.log('render');

  const closeHandler = () => {
    routeExtendCard();
  };

  const onSubmitChallenge = challData => {
    asyncSubmitChallenge({
      ...challData,
      playerId,
      cardId,
      userEnv,
    });
  };

  const db = DB(userEnv);

  const filePath = `challengeSubmissions/${cardId}/${playerId}`;
  const removeFromStorage = fileId =>
    db.removeFileFromEnv({
      path: filePath,
      id: fileId,
    });
  const addToStorage = ({file, id}) =>
    db.addFileToEnv({file, path: filePath, id});

  const onFlip = routeFlipCard;

  // const authorDataPromise = db.getDetailedUserInfo(authorId);
  // const fetchComments = cardId ? () => db.readComments(cardId) : null;
  // const addComment = text => db.addComment({ uid: playerId, cardId, text });

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
    onSubmitChallenge,
    ...backCardFuncs,
    addToStorage,
    removeFromStorage,
    onClose: onClose || closeHandler,
    onFlip,
    flipped,
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
