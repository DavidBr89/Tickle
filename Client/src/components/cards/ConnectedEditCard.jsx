import React from 'react';
import PropTypes from 'prop-types';
// import chroma from 'chroma-js';
import {compose} from 'recompose';

import Trash2 from 'react-feather/dist/icons/trash-2';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {withRouter} from 'react-router-dom';

import DB from '~/firebase/db/card_db';
import * as cardActions from '~/reducers/Cards/actions';

import {changeMapViewport} from '~/reducers/Map/actions';

import * as asyncCardActions from '~/reducers/Cards/async_actions';

import cardRoutes from '~/Routes/cardRoutes';
import {initCardFields, TEMP_ID} from '~/constants/cardFields';
import makeBackCardFuncs from './backCardDbMixins';
import EditCardFront from './CardFront/EditCardFront';

import CardBack from './CardBack';

import CardFrame from './CardFrame';

const DeleteButton = ({style, className, onClick}) => (
  <button
    className={`pl-10 pr-10 btn btn-black bg-danger ${className}`}
    type="button"
    style={{
      alignItems: 'center',
      ...style
    }}
    onClick={onClick}>
    <div>
      <Trash2 size={30} />
    </div>
  </button>
);

DeleteButton.propTypes = {
  style: PropTypes.object,
  onClick: PropTypes.func,
  className: PropTypes.string
};

DeleteButton.defaultProps = {
  style: {},
  onClick: d => d,
  className: ''
};

function mapStateToProps(state) {
  return {
    ...state.MapView,
    ...state.Cards,
    ...state.DataView,
    ...state.Screen,
    userLocation: state.MapView.userLocation,
    ...state.Session
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      // dragCard,
      ...cardActions,
      ...asyncCardActions,
      changeMapViewport
    },
    dispatch
  );

const mergeProps = (state, dispatcherProps, ownProps) => {
  // Rename topic
  const {userEnvId, authUser, topicVocabulary} = state;
  const {uid: authorId} = authUser;

  // TODO: this is weird, I cannot set defaultProps
  const defProps = {...initCardFields, ...ownProps};

  const {
    location,
    history,
    id: cardId,
    topics: {value: topicValues},
    onCreateCard = d => d,
    onUpdateCard = d => d
  } = defProps;

  // TODO: BUILD IN check
  // const {userEnv: userEnvId} = match.params;

  const {
    query: {extended, flipped},
    routing: {routeFlipCard, routeExtendCard}
  } = cardRoutes({history, location});

  const {
    updateCardTemplate,
    asyncCreateCard,
    asyncUpdateCard,
    asyncRemoveCard
  } = dispatcherProps;

  const createCard = cardData =>
    asyncCreateCard({cardData, userEnvId}).then(() =>
      onCreateCard(cardData)
    );

  const updateCard = cardData =>
    asyncUpdateCard({cardData, userEnvId}).then(() =>
      onUpdateCard(cardData)
    );

  const removeCard = () => asyncRemoveCard({cardId, userEnvId});

  const onCardUpdate = cardData => {
    // TODO why that
    // take form const
    cardData.id === TEMP_ID
      ? updateCardTemplate(cardData)
      : updateCard(cardData);
  };

  const db = DB(userEnvId);

  const filePath = `cards/${authorId}/${cardId}`;

  const removeFromStorage = fileId =>
    db.removeFileFromEnv({
      path: filePath,
      id: fileId
    });

  const addToStorage = ({file, id}) =>
    db.addFileToEnv({file, path: filePath, id});
  // const fetchComments = cardId ? () => db.readComments(cardId) : null;
  // const addComment = text => db.addComment({ uid: authorId, cardId, text });

  const relatedCardsByTag =
    topicValues !== null
      ? topicVocabulary.filter(d => topicValues.includes(d.tagId))
      : [];

  console.log('userEnvId', userEnvId);
  const backCardFuncs = makeBackCardFuncs({
    userEnvId,
    cardId,
    playerId: authorId,
    authorId
  });

  const onClose = routeExtendCard;

  const onFlip = routeFlipCard;

  return {
    ...state,
    ...dispatcherProps,
    onCardUpdate,
    createCard,
    onClose,
    onFlip,
    flipped,
    removeCard,
    topicVocabulary,
    addToStorage,
    removeFromStorage,
    ...backCardFuncs,
    relatedCardsByTag,
    ...defProps
  };
};

/**
 * Representation Component for editable card
 */
const EditCard = ({
  createCard,
  removeCard,
  onCardUpdate,
  x,
  y,
  onClose,
  flipped,
  onCreate,
  template,
  onFlip,
  fetchAuthorData,
  id,
  cardFields,
  ...props
}) => (
  <CardFrame
    key={id}
    flipped={flipped}
    front={
      <EditCardFront
        {...props}
        template={template}
        id={id}
        onClose={onClose}
        onFlip={onFlip}
        onCreate={d => {
          createCard({...d, x, y});
          onClose();
        }}
        onUpdate={d => {
          onCardUpdate({...d, x, y});
        }}
      />
    }
    back={
      <CardBack
        {...props}
        id={id}
        onClose={onClose}
        fetchAuthorData={fetchAuthorData}
        onFlip={onFlip}
        edit
        controls={
          !template ? (
            <DeleteButton
              onClick={() => {
                onClose();
                removeCard(props.id);
              }}
            />
          ) : null
        }
      />
    }
  />
);

EditCard.defaultProps = {
  createCard: d => d,
  onCreateCard: d => d,
  onUpdateCard: d => d,
  removeCard: d => d,
  onCardUpdate: d => d,
  x: 0,
  y: 0,
  onClose: d => d,
  flipped: false,
  template: false,
  onFlip: d => d,
  fetchAuthorData: d => d,
  ...initCardFields
};

/**
 * Connect the EditCard component to the Store
 */
export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )
)(EditCard);
