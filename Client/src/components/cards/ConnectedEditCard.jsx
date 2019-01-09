import React from 'react';
import PropTypes from 'prop-types';
// import chroma from 'chroma-js';
import {compose} from 'recompose';

import Trash2 from 'react-feather/dist/icons/trash-2';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {withRouter} from 'react-router-dom';

import {DB} from 'Firebase';

import {TEMP_ID} from 'Constants/cardFields';

import * as cardActions from 'Reducers/Cards/actions';

import {changeMapViewport} from 'Reducers/Map/actions';

import * as asyncCardActions from 'Reducers/Cards/async_actions';

import cardRoutes from 'Src/Routes/cardRoutes';
import makeBackCardFuncs from './backCardDbMixins';
import EditCardFront from './CardFront/EditCardFront';

import CardBack from './CardBack';

import CardFrame from './CardFrame';

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
  const {mapViewport, width, height, authUser, tagVocabulary} = state;
  const {uid: authorId} = authUser;

  const {
    match,
    location,
    history,
    id: cardId,
    tags: {value: tagValues},
    onCreateCard = d => d,
    onUpdateCard = d => d
  } = ownProps;

  console.log('ONUPDATE CARD', onUpdateCard);
  // TODO: BUILD IN check
  const {userEnv: userEnvId} = match.params;

  const {
    query: {selectedCardId, extended, flipped},
    routing: {routeFlipCard, routeExtendCard}
  } = cardRoutes({history, location});

  const {
    updateCardTemplate,
    asyncCreateCard,
    asyncUpdateCard,
    asyncRemoveCard
  } = dispatcherProps;

  const createCard = cardData => {
    console.log('why that?', cardData);
    return asyncCreateCard({cardData, userEnvId}).then(() =>
      onCreateCard(cardData)
    );
  };

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
    tagValues !== null
      ? tagVocabulary.filter(d => tagValues.includes(d.tagId))
      : [];

  const backCardFuncs = makeBackCardFuncs({
    userEnv: userEnvId,
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
    tagVocabulary,
    addToStorage,
    removeFromStorage,
    ...backCardFuncs,
    ...ownProps,
    relatedCardsByTag
  };
};

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
  fetchAuthorData: d => d
};

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )
)(EditCard);
